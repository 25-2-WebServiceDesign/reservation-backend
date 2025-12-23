const CustomError = require("../responses/customError");
const { userRepo } = require("../repositories");

exports.getMe = async (userId) => {
    const user = await userRepo.findById(userId);

    if (!user) {
        throw new CustomError("NOT_FOUND", "사용자를 찾을 수 없습니다.", 404);
    }

    return user;
};