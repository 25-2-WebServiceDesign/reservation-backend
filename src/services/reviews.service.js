const CustomError = require("../responses/customError");
const { reviewRepo, reservationRepo } = require("../repositories");

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

exports.getReviewById = async (id) => {
  const review = await reviewRepo.findById(id); // ✅ reviewRepository -> reviewRepo
  if (!review) throw notFound("리뷰 찾을 수 없음");
  return review;
};


exports.createReview = async (userId, { reservationId, rating, content = null }) => {
  if (!Number.isInteger(reservationId) || reservationId <= 0) throw badRequest("reservationId is required");
  if (!Number.isInteger(rating)) throw badRequest("rating is required");
  if (rating < 0 || rating > 10) throw badRequest("rating must be 0~10");

  const reservation = await reservationRepo.findById(reservationId);
  if (!reservation) throw notFound("예약을 찾을 수 없음");

  const ownerId = reservation.userId ?? reservation.uid;
  if (ownerId == null) throw badRequest("reservation owner field is missing");
  if (String(ownerId) !== String(userId)) throw forbidden("본인 예약에만 리뷰 작성 가능");

  const exists = await reviewRepo.findOne({ reservationId });
  if (exists) throw conflict("해당 예약에는 이미 리뷰가 작성됨");

  return reviewRepo.create({ userId, reservationId, rating, content });
};

exports.getMyReviews = async (userId) => {
  return reviewRepo.findAll({ userId });
};


exports.updateMyReview = async (userId, reviewId, { rating, content }) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw notFound("리뷰 찾을 수 없음");
  if (String(review.userId) !== String(userId)) throw forbidden("본인 리뷰만 수정 가능");

  const data = {};
  if (rating !== undefined) {
    if (!Number.isInteger(rating) || rating < 0 || rating > 10) throw badRequest("rating must be 0~10");
    data.rating = rating;
  }
  if (content !== undefined) data.content = content;

  return reviewRepo.update(reviewId, data);
};

// 리뷰 삭제(soft delete)
exports.deleteMyReview = async (userId, reviewId) => {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw notFound("리뷰 찾을 수 없음");
  if (String(review.userId) !== String(userId)) throw forbidden("본인 리뷰만 삭제 가능");

  await reviewRepo.remove(reviewId);
  return { message: "리뷰가 삭제되었습니다." };
};
