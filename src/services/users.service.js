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

function reviewSaftyWrapper(review) {
  const safeReview = {
    id: review.id,
    userId: review.userId,
    reservationId: review.reservationId,
    rating: review.rating,
    content: review.content,
  }
  return safeReview;
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

exports.changeRole = async (userId, newRole) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new CustomError("NOT_FOUND", "user is not founded", 404);
  }

  // role update
  const updatedUser = await userRepo.update(userId, {role: newRole});

  if (!updatedUser) {
    throw new CustomError("NOT_FOUND", "user is not founded", 404);
  }

  return updatedUser;
}

exports.getReviews = async (userId, page, limit) => {
  // read user
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new CustomError("UNAUTHORIZED", "authorization context is no longer valid", 401);
  }

  // read reviews
  const offset = limit * (page - 1)
  const {rows, count} = await reviewRepo.findAndCountAll({
    where: {userId},
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  })

  return {
    data: rows.map(reviewSaftyWrapper),
    totalCount: count,
    totalPage: Math.ceil(count / limit),
  }
}