const CustomError = require("../responses/customError");
const reviewRepository = require("../repositories/review.repository");

exports.getReviewById = async (id) => {
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new CustomError("NOT_FOUND", "리뷰 찾을 수 없음", 404);
  }

  return review;
};
