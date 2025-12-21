const { sequelize } = require("../models");
const {userRepo, userAuthRepo} = require("../repositories");

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

            // 있으면
            if (userAuth) {
                const user = await userRepo.findById(userAuth.userId, {transaction});
                
                if (!user) {
                    throw new AppError("NOT_FOUND", 404, "user is not founded");
                }
                // jwt 토큰 발급 및 반환
                

                return user;
            }

            

            



        } catch(err) {

        }
    },
}