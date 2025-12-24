const sequelize = require("../config/sequelize");

const CustomError = require("../responses/customError");
const { userRepo } = require("../repositories");
const { reviewRepo, reservationRepo } = require("../repositories");

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

exports.updateMe = async (userId, payload) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new CustomError("NOT_FOUND", "사용자를 찾을 수 없습니다.", 404);
  }

  const updateData = {};
  if (payload.nickname !== undefined) updateData.nickname = payload.nickname;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.profileImage !== undefined) updateData.profileImage = payload.profileImage;

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("BAD_REQUEST", "nothing to update", 400);
  }

  // userRepo.update는 update 후 findById 반환함
  await userRepo.update(userId, updateData);
  const updated = await userRepo.findById(userId);

  return userSaftyRapper(updated);
};

exports.deleteMe = async (userId) => {
  const affected = await userRepo.remove(userId);
  
  if (affected === 0) {
    throw new CustomError("NOT_FOUND", "user not founed", 404);
  }

  return {message: "soft delete completed!"}
}