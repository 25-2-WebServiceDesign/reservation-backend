const CustomError = require("../responses/customError");
const ApiResponse = require("../responses/ApiResponse");
const reservationsService = require("../services/reservations.service");

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
      new ApiResponse(data, {
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
