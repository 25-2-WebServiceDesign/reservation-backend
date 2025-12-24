const CustomError = require("../responses/customError");
const { userRepo } = require("../repositories");

function userSaftyRapper(user) {
    const safeUser = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role
    }
    return safeUser;
}

exports.getById = async (userId) => {
    const user = await userRepo.findById(userId);

    if (!user) {
        throw new CustomError("NOT_FOUND", "사용자를 찾을 수 없습니다.", 404);
    }

    return userSaftyRapper(user);
};
