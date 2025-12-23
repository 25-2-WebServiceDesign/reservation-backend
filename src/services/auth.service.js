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
        const transaction = await sequelize.transaction();
        const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

        try {
            const userAuth = await userAuthRepo.findOne({
                provider: "GOOGLE",
                providerUid: decoded.uid,
            }, {transaction});

            let user = await userRepo.findById(userAuth?.id, {transaction});
            console.log("user: ", user)

            // 유저가 없으면 회원가입
            if (!user) {
                const userData = {
                    nickname: decoded.name,
                    email: decoded.email,
                    phone: decoded.phone_number || null,
                    profileImage: decoded.picture,
                }
                console.log(userData)
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

            if (refreshTokens) {
                for (const index in refreshTokens) {
                    const refreshToken = refreshTokens[index].dataValues
                    await refreshTokenRepo.update(
                        refreshToken.id, 
                        {revokedAt: new Date()}, 
                        {transaction}
                    )
                }
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

            let user = await userRepo.findById(userAuth.userId, {transaction});

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

            if (refreshTokens) {
                for (const index in refreshTokens) {
                    const refreshToken = refreshTokens[index].dataValues
                    await refreshTokenRepo.update(
                        refreshToken.id, 
                        {revokedAt: new Date()}, 
                        {transaction}
                    )
                }
            }

            const resData = await getJWTTokens(user, transaction);

            await transaction.commit();
            return resData;
        } catch(err) {
            await transaction.rollback()
            throw err
        }
    }
}