const CustomError = require("../responses/customError");
const { reviewRepo, reservationRepo } = require("../repositories");
const { Reservation, Review } = require("../models");

const {sequelize} = require("../models")

function badRequest(msg) {
  return new CustomError("BAD_REQUEST", msg, 400);
}
function notFound(msg) {
  return new CustomError("NOT_FOUND", msg, 404);
}
function forbidden(msg) {
  return new CustomError("FORBIDDEN", msg, 403);
}
function conflict(msg) {
  return new CustomError("CONFLICT", msg, 409);
}

function reviewSafetyWrapper(r) {
  return {
    id: r.id,
    reservationId: r.reservationId,
    userId: r.userId,
    content: r.content,
    rating: r.rating,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

exports.getReviewById = async (id) => {
  const review = await reviewRepo.findById(id);
  if (!review) throw notFound("리뷰 찾을 수 없음");
  return reviewSaftyWrapper(review);
};


exports.updateMyReview = async (userId, reviewId, { rating, content }) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw notFound("리뷰 찾을 수 없음");

  if (Number(review.userId) !== Number(userId)) throw forbidden("본인 리뷰만 수정 가능");

  const data = {};
  if (rating !== undefined) {
    if (!Number.isInteger(rating) || rating < 0 || rating > 10) throw badRequest("rating must be 0~10");
    data.rating = rating;
  }
  if (content !== undefined) data.content = content;

  const transaction = await sequelize.transaction();

  try {  
    const updatedReivew = await reviewRepo.update(reviewId, data, {transaction});
    await transaction.commit();
    return updatedReivew;
  } catch(err) {
    await transaction.rollback();
    throw err;
  }
};

// 리뷰 삭제(soft delete)
exports.deleteMyReview = async (userId, reviewId) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw notFound("리뷰 찾을 수 없음");
  if (String(review.userId) !== String(userId)) throw forbidden("본인 리뷰만 삭제 가능");

  await reviewRepo.remove(reviewId);
  return { message: "리뷰가 삭제되었습니다." };
};


exports.createReviewForReservation = async (userId, reservationId, { rating, content = null }) => {
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    throw badRequest("reservationId is invalid");
  }
  if (!Number.isInteger(rating)) throw badRequest("rating is required");
  if (rating < 0 || rating > 10) throw badRequest("rating must be 0~10");

  const reservation = await reservationRepo.findOne({ id: reservationId, userId });
  if (!reservation) throw notFound("Reservation not found");

  if (String(reservation.status).toUpperCase() === "CANCELED") {
    throw badRequest("Canceled reservation cannot be reviewed");
  }

  const exists = await reviewRepo.findOne({ reservationId });
  if (exists) throw conflict("Review already exists for this reservation");

  return reviewRepo.create({ userId, reservationId, rating, content });
};