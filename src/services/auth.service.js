const firebaseAdmin = require("../config/firebase");
const { sequelize } = require("../models");
const { userAuthRepo, userRepo, refreshTokenRepo } = require('../repositories')

const CustomError = require("../responses/customError")

async function getJWTTokens(user, transaction) {
    const jwtUtil = require("../utils/jwt.util");

    const accessToken = jwtUtil.generateAccessToken({id: user.id, role: user.role});
    const refreshToken = jwtUtil.generateRefreshToken(user.id);

    // refresh Token 재설정
    await refreshTokenRepo.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(jwtUtil.verifyRefreshToken(refreshToken).exp * 1000),
    }, {transaction});

    const expiresIn = jwtUtil.accessTokenExpiresIn;

    return {
        user,
        accessToken,
        refreshToken,
        expiresIn,
    }
}


module.exports = {
    async googleLogin(idToken) {
        // firebase_config.json 없어서 추가
        if(!firebaseAdmin) {
            throw new CustomError(
                "SERVICE_UNAVAILABLE",
                "Firebase authentication is not configured",
                503
            );
        }
        const transaction = await sequelize.transaction();
        const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

        try {
            const userAuth = await userAuthRepo.findOne({
                provider: "GOOGLE",
                providerUid: decoded.uid,
            }, {transaction});

            let user = await userRepo.findById(userAuth?.userId, {transaction});

            // 유저가 없으면 회원가입
            if (!user) {
                const userData = {
                    nickname: decoded.name,
                    email: decoded.email,
                    phone: decoded.phone_number || null,
                    profileImage: decoded.picture,
                }
                // User 새로 생성
                user = await userRepo.create(userData, {transaction});

                // Auth 새로 생성
                await userAuthRepo.create({
                    userId: user.id,
                    provider: "GOOGLE",
                    providerUid: decoded.uid,
                }, {transaction});
            }

            // refreshToken 이 이미 있는지 확인 (있다면 비활성화하고 새로 반환)
            const refreshTokens = await refreshTokenRepo.findAll({
                userId: user.id,
                revokedAt: null,
            }, {transaction});

            for (const token of refreshTokens) {
                await refreshTokenRepo.update(
                    token.id, 
                    {revokedAt: new Date()}, 
                    {transaction}
                )
            }
            

            const resData = await getJWTTokens(user, transaction);

            await transaction.commit();
            return resData;
        } catch(err) {
            await transaction.rollback()
            throw new CustomError("Internal_Server_Error", "DB query error", 500);
        }
    },

    async naverLogin(profile) {
        const transaction = await sequelize.transaction();

        try {
            // id 확인
            const userAuth = await userAuthRepo.findOne({
                providerUid: profile.id,
                provider: "NAVER",
            }, {transaction})

            let user = await userRepo.findById(userAuth?.userId, {transaction});

            // 없으면 유저 생성
            if (!user) {
                const userData = {
                    nickname: profile.name,
                    email: profile.email,
                    phone: profile.mobile_e164,
                    profileImage: profile.profile_image,
                }

                user = await userRepo.create(userData, {transaction});

                // Auth 새로 생성
                await userAuthRepo.create({
                    userId: user.id,
                    provider: "NAVER",
                    providerUid: profile.id,
                }, {transaction});
            }


            // refreshToken 이 이미 있는지 확인 (있다면 비활성화하고 새로 반환)
            const refreshTokens = await refreshTokenRepo.findAll({
                userId: user.id,
                revokedAt: null,
            }, {transaction});

            for (const token of refreshTokens) {
                await refreshTokenRepo.update(
                    token.id, 
                    {revokedAt: new Date()}, 
                    {transaction}
                )
            }

            const resData = await getJWTTokens(user, transaction);

            await transaction.commit();
            return resData;
        } catch(err) {
            await transaction.rollback()
            throw err
        }
    },

    async refresh(refreshToken) {
        // refreshToken 검증
        const jwtUtil = require("../utils/jwt.util");
        const decoded = jwtUtil.verifyRefreshToken(refreshToken);

        if (!decoded) {
            throw new CustomError("UNAUTHORIZED", "refreshToken is expired or invalid", 401)
        }

        const transaction = await sequelize.transaction()
        try {
            // refreshToken Table에서 찾기
            const token = await refreshTokenRepo.findOne({
                token: refreshToken,
                userId: decoded.id,
            }, {transaction});

            if (!token || token.revokedAt) {
                throw new CustomError("NOT_FOUND", "refreshToken is not founded in DB", 401);
            }
            // 비활성화
            await refreshTokenRepo.update(token.id, {
                revokedAt: new Date()
            }, {transaction});

            // 재발급
            const user = await userRepo.findById(decoded.id, {transaction});

            if (!user) {
                throw new CustomError("UNAUTHORIZED", "user is not founded", 401);
            }

            const resData = await getJWTTokens(user, transaction);

            await transaction.commit()
            return resData;
        } catch(err) {
            await transaction.rollback()
            throw err
        }
    },

    async logout(refreshToken) {
        const jwtUtil = require("../utils/jwt.util");
        const decoded = jwtUtil.verifyRefreshToken(refreshToken);

        if (!decoded) {
            throw new CustomError("UNAUTHORIZED", "refreshToken is expired or invalid", 401)
        }

        const transaction = await sequelize.transaction();
        try {
            // refreshToken 테이블에서 찾기
            const token = await refreshTokenRepo.findOne({
                token: refreshToken,
                userId: decoded.id
            }, {transaction});

            if (!token || token.revokedAt) {
                throw new CustomError("UNAUTHORIZED", "refreshToken is not founded in DB", 401);
            }

            // 비활성화
            await refreshTokenRepo.update(token.id, {
                revokedAt: new Date()
            }, {transaction});

            await transaction.commit();
            return {message: "logout completed!"}

        } catch(err) {
            await transaction.rollback()
            throw err;
        }

    },
}