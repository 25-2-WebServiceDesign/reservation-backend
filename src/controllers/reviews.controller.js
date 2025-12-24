const CustomError = require("../responses/customError");
const reviewsService = require("../services/reviews.service");

exports.getReviewById = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "invalid review id", 400));
  }

  try {
    const review = await reviewsService.getReviewById(id);
    return res.status(200).json(review);
  } catch (err) {
    return next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

    const created = await reviewsService.createReview(userId, req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

    const reviews = await reviewsService.getMyReviews(userId);
    return res.status(200).json(reviews);
  } catch (err) {
    return next(err);
  }
};

exports.updateMyReview = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "invalid review id", 400));
  }

  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

    const updated = await reviewsService.updateMyReview(userId, id, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};

exports.deleteMyReview = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "invalid review id", 400));
  }

  try {
    const userId = req.user?.id;
    if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

    const result = await reviewsService.deleteMyReview(userId, id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};
