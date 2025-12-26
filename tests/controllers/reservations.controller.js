const CustomError = require("../responses/customError");
const ApiResponse = require("../responses/ApiResponse");
const reservationsService = require("../services/reservations.service");
const reviewsService = require("../services/reviews.service");

exports.getMyReservations = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const order = String(req.query.order ?? "desc").toLowerCase(); // asc | desc

  try {
    const { data, totalCount, totalPage } =
      await reservationsService.getMyReservations(req.user.id, { page, limit, order });

    return res.status(200).json(
      new ApiResponse({reservations: data}, {
        page,
        limit,
        totalCount,
        totalPage,
      })
    );
  } catch (err) {
    return next(err);
  }
};

exports.getReservationById = async (req, res, next) => {
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return next(new CustomError("BAD_REQUEST", "reservationId is invalid", 400));
  }

  try {
    const reservation = await reservationsService.getReservationById(
      req.user.id,
      reservationId
    );

    return res.status(200).json(new ApiResponse({reservation}));
  } catch (err) {
    return next(err);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return next(new CustomError("BAD_REQUEST", "reservationId is invalid", 400));
  }

  const status = String(req.body?.status ?? "").trim().toUpperCase();
  if (!status) {
    return next(new CustomError("BAD_REQUEST", "status is required", 400));
  }

  try {
    let updated;
    if (req.user.role === "CUSTOMER") {
      updated = await reservationsService.updateReservationStatus(
        req.user.id,
        reservationId,
        status
      );
    } else if (req.user.role === "OWNER") {
      console.log("owner")
      updated = await reservationsService.updateReservationStatusByOwner(
        req.user.id,
        reservationId,
        status
      );
    }
    

    return res.status(200).json(new ApiResponse({reservation: updated}));
  } catch (err) {
    return next(err);
  }
};

exports.updateReservation = async (req, res, next) => {
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId <= 0) {
    return next(new CustomError("BAD_REQUEST", "reservationId is invalid", 400));
  }

  const { memo, headcount, status } = req.body ?? {};

  // status는 PUT에서 변경 불가
  if (status !== undefined) {
    return next(new CustomError("BAD_REQUEST", "status cannot be changed via PUT", 400));
  }

  try {
    const updated = await reservationsService.updateReservation(
      req.user.id,
      reservationId,
      { memo, headcount }
    );

    return res.status(200).json(new ApiResponse({reservation: updated}));
  } catch (err) {
    return next(err);
  }
};
