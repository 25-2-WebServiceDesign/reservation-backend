const ApiResponse = require("../responses/ApiResponse");
const CustomError = require("../responses/customError");
const reviewsService = require("../services/reviews.service");

exports.getReviewById = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "invalid review id", 400));
  }

  try {
    const review = await reviewsService.getReviewById(id);
    return res.status(200).json({review});
  } catch (err) {
    return next(err);
  }
};

exports.updateMyReview = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new CustomError("BAD_REQUEST", "invalid review id", 400));
  }

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

  try {

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

  const userId = req.user?.id;
  if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));


  try {
    const result = await reviewsService.deleteMyReview(userId, id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

exports.createReviewForReservation = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next(new CustomError("UNAUTHORIZED", "login required", 401));

  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return next(new CustomError("BAD_REQUEST", "reservationId is invalid", 400));
  }

  const content = String(req.body?.content ?? "").trim();
  const rating = Number(req.body?.rating);

  if (!content) {
    return next(new CustomError("BAD_REQUEST", "content is required", 400));
  }
  if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
    return next(new CustomError("BAD_REQUEST", "rating must be 0~10", 400));
  }
  try {
    const created = await reviewsService.createReviewForReservation(userId, reservationId, {
      rating,
      content,
    });

    return res.status(201).json(new ApiResponse({review: created}));
  } catch (err) {
    return next(err);
  }
};