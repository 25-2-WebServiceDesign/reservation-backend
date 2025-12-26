const firebaseAdmin = require("../config/firebase");
const { sequelize } = require("../models");
const { userAuthRepo, userRepo, refreshTokenRepo } = require("../repositories");

const {
  storeRefreshToken,
  existsRefreshToken,
  revokeRefreshToken,
} = require("./tokenCache.service");

const CustomError = require("../responses/customError");

async function getJWTTokens(user, transaction) {
  const jwtUtil = require("../utils/jwt.util");

  const accessToken = jwtUtil.generateAccessToken({
    id: user.id,
    role: user.role,
  });
  const refreshToken = jwtUtil.generateRefreshToken(user.id);

  const decoded = jwtUtil.verifyRefreshToken(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  // DB 저장
  await refreshTokenRepo.create(
    {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
    { transaction }
  );

  // Redis 저장 (TTL)
  const ttlSec = Math.max(
    1,
    Math.floor(expiresAt.getTime() / 1000 - Date.now() / 1000)
  );
  await storeRefreshToken(user.id, refreshToken, ttlSec);

  return {
    user,
    accessToken,
    refreshToken,
    expiresIn: jwtUtil.accessTokenExpiresIn,
  };
}

module.exports = {
  async googleLogin(idToken) {
    if (!firebaseAdmin) {
      throw new CustomError(
        "SERVICE_UNAVAILABLE",
        "Firebase authentication is not configured",
        503
      );
    }

    const transaction = await sequelize.transaction();
    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

      const userAuth = await userAuthRepo.findOne(
        {
          provider: "GOOGLE",
          providerUid: decoded.uid,
        },
        { transaction }
      );

      let user = await userRepo.findById(userAuth?.userId, { transaction });

      if (!user) {
        user = await userRepo.create(
          {
            nickname: decoded.name,
            email: decoded.email,
            phone: decoded.phone_number || null,
            profileImage: decoded.picture,
          },
          { transaction }
        );

        await userAuthRepo.create(
          {
            userId: user.id,
            provider: "GOOGLE",
            providerUid: decoded.uid,
          },
          { transaction }
        );
      }

      // 기존 refreshToken 전부 폐기 (DB + Redis)
      const refreshTokens = await refreshTokenRepo.findAll(
        {
          userId: user.id,
          revokedAt: null,
        },
        { transaction }
      );

      for (const token of refreshTokens) {
        await refreshTokenRepo.update(
          token.id,
          { revokedAt: new Date() },
          { transaction }
        );
        await revokeRefreshToken(user.id, token.token);
      }

      const resData = await getJWTTokens(user, transaction);
      await transaction.commit();
      return resData;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async naverLogin(profile) {
    const transaction = await sequelize.transaction();
    try {
      const userAuth = await userAuthRepo.findOne(
        {
          provider: "NAVER",
          providerUid: profile.id,
        },
        { transaction }
      );

      let user = await userRepo.findById(userAuth?.userId, { transaction });

      if (!user) {
        user = await userRepo.create(
          {
            nickname: profile.name,
            email: profile.email,
            phone: profile.mobile_e164,
            profileImage: profile.profile_image,
          },
          { transaction }
        );

        await userAuthRepo.create(
          {
            userId: user.id,
            provider: "NAVER",
            providerUid: profile.id,
          },
          { transaction }
        );
      }

      // 기존 refreshToken 전부 폐기 (DB + Redis)
      const refreshTokens = await refreshTokenRepo.findAll(
        {
          userId: user.id,
          revokedAt: null,
        },
        { transaction }
      );

      for (const token of refreshTokens) {
        await refreshTokenRepo.update(
          token.id,
          { revokedAt: new Date() },
          { transaction }
        );
        await revokeRefreshToken(user.id, token.token);
      }

      const resData = await getJWTTokens(user, transaction);
      await transaction.commit();
      return resData;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async refresh(refreshToken) {
    const jwtUtil = require("../utils/jwt.util");

    const decoded = jwtUtil.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new CustomError(
        "UNAUTHORIZED",
        "refreshToken is expired or invalid",
        401
      );
    }

    // Redis 1차 검증
    const inRedis = await existsRefreshToken(decoded.id, refreshToken);
    if (!inRedis) {
      throw new CustomError(
        "UNAUTHORIZED",
        "refreshToken is revoked or expired (redis)",
        401
      );
    }

    const transaction = await sequelize.transaction();
    try {
      const token = await refreshTokenRepo.findOne(
        {
          token: refreshToken,
          userId: decoded.id,
        },
        { transaction }
      );

      if (!token || token.revokedAt) {
        throw new CustomError(
          "UNAUTHORIZED",
          "refreshToken is not found in DB",
          401
        );
      }

      // 기존 refreshToken 폐기 (DB + Redis)
      await refreshTokenRepo.update(
        token.id,
        { revokedAt: new Date() },
        { transaction }
      );
      await revokeRefreshToken(decoded.id, refreshToken);

      const user = await userRepo.findById(decoded.id, { transaction });
      if (!user) {
        throw new CustomError("UNAUTHORIZED", "user not found", 401);
      }

      const resData = await getJWTTokens(user, transaction);
      await transaction.commit();
      return resData;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async logout(refreshToken) {
    const jwtUtil = require("../utils/jwt.util");

    const decoded = jwtUtil.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new CustomError(
        "UNAUTHORIZED",
        "refreshToken is expired or invalid",
        401
      );
    }

    const transaction = await sequelize.transaction();
    try {
      const token = await refreshTokenRepo.findOne(
        {
          token: refreshToken,
          userId: decoded.id,
        },
        { transaction }
      );

      if (!token || token.revokedAt) {
        throw new CustomError(
          "UNAUTHORIZED",
          "refreshToken is not found in DB",
          401
        );
      }

      // 폐기 (DB + Redis)
      await refreshTokenRepo.update(
        token.id,
        { revokedAt: new Date() },
        { transaction }
      );
      await revokeRefreshToken(decoded.id, refreshToken);

      await transaction.commit();
      return { message: "logout completed!" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
