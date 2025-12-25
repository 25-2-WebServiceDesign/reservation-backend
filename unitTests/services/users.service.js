const sequelize = require("../config/sequelize");

const CustomError = require("../responses/customError");
const { Store, Favorite } = require("../models");
const { userRepo, reviewRepo, reservationRepo } = require("../repositories");

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

function storeSafetyWrapper(store) {
  return {
    id: store.id,
    ownerId: store.ownerId,
    name: store.name,
    category: store.category,
    address: store.address,
    phone: store.phone,
    homepageUrl: store.homepageUrl,
    detail: store.detail,
    createdAt: store.createdAt,
  };
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
    page,
    offset,
    order: [["createdAt", "DESC"]]
  })

  return {
    data: rows.map(reviewSaftyWrapper),
    totalCount: count,
    totalPage: Math.ceil(count / limit),
  }
}

exports.getFavorites = async (userId, { page = 1, limit = 10, order = "desc" } = {}) => {
  const p = Number(page);
  const l = Number(limit);
  const ord = order === "asc" ? "ASC" : "DESC";

  if (!Number.isInteger(p) || p <= 0) {
    throw new CustomError("BAD_REQUEST", "page must be a positive integer", 400);
  }
  if (!Number.isInteger(l) || l <= 0 || l > 100) {
    throw new CustomError("BAD_REQUEST", "limit must be 1~100", 400);
  }

  const offset = (p - 1) * l;

  // Favorite 기준으로 조회
  const { rows, count } = await Favorite.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Store,
        required: true,
      },
    ],
    limit: l,
    offset,
    order: [["createdAt", ord]],
  });

  return {
    data: rows.map((fav) => ({
      id: fav.Store.id,
      ownerId: fav.Store.ownerId,
      name: fav.Store.name,
      category: fav.Store.category,
      address: fav.Store.address,
      phone: fav.Store.phone,
      homepageUrl: fav.Store.homepageUrl,
      detail: fav.Store.detail,
      createdAt: fav.Store.createdAt,
    })),
    totalCount: count,
    totalPage: Math.ceil(count / l),
  };
};