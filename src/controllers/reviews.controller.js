const CustomError = require("../responses/customError");
const reviewsService = require("../services/reviews.service");

exports.getReviewById = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "review id is required", 400));
  }

  try {
    const review = await reviewsService.getReviewById(id);
    return res.status(200).json(review); 
  } catch (err) {
    return next(err);
  }
};
