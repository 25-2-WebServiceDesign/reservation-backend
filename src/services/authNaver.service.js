const { sequelize } = require("../models");
const {userRepo, userAuthRepo, refreshTokenRepo} = require("../repositories");

const AppError = require('../responses/AppError')

module.exports = {
    // 계정이 있다면 바로 로그인, 없다면 생성 후 로그인
    async login(profile) {
        const transaction = await sequelize.transaction();

        try {
            // id 확인
            const userAuth = await userAuthRepo.findOne({
                providerUid: profile.id,
                provider: "NAVER",
            }, {transaction})
            
            let userId = userAuth?.userId;

            // 없으면 유저 생성
            if (!userId) {
                const userData = {
                    nickname: profile.name,
                    email: profile.email,
                    phone: profile.mobile_e164,
                    profileImage: profile.profile_image,
                }
                const newUser = await userRepo.create(userData, {transaction});

                // Auth 새로 생성
                await userAuthRepo.create({
                    userId: newUser.id,
                    provider: "NAVER",
                    providerUid: profile.id,
                }, {transaction});

                userId = newUser.id;
            }

            // 유저 읽어오기
            const user = await userRepo.findById(userId, {transaction});

            if (!user) {
                throw new AppError("NOT_FOUND", 404, "user is not founded");
            }

            const jwtUtil = require("../utils/jwt.util");

            const accessToken = jwtUtil.generateAccessToken({id: user.id, role: user.role});
            const refreshToken = jwtUtil.generateRefreshToken(user.id);
            
            // refresh Token 재설정
            const newRefreshToken = await refreshTokenRepo.create({
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(jwtUtil.verifyRefreshToken(refreshToken).exp * 1000),
            }, {transaction});

            const expiresIn = jwtUtil.accessTokenExpiresIn;

            await transaction.commit();
            return {
                user,
                accessToken,
                refreshToken,
                expiresIn
            };
        } catch(err) {
            await transaction.rollback()
            throw err
        }
    },

    async createUser(userData) {
        
    }
}