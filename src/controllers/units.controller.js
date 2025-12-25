const ApiResponse = require("../responses/ApiResponse");
const CustomError = require("../responses/customError");

const unitsService = require("../services/units.service");


function isValidDateYYYYMMDD(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const d = new Date(`${dateStr}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return false;

  const [y, m, day] = dateStr.split("-").map(Number);

  return (
    d.getFullYear() === y &&
    d.getMonth() + 1 === m &&
    d.getDate() === day
  );
}


exports.getAvailability = async (req, res, next) => {
  // input validation
  const unitId = Number(req.params.id);
  const { date } = req.query;

  if (!Number.isInteger(unitId) || unitId < 0) {
    return next(new AppError("BAD_REQUEST", 400, "positive integer unitId is required"));
  }

  if (!isValidDateYYYYMMDD(date)) {
    return next(new AppError("BAD_REQUEST", 400, "Invalid date (YYYY-MM-dd)"));
  }

  // process
  try {
    const result = await unitsService.getUnitAvailability({ unitId, date });
    return res.status(200).json(new ApiResponse(result));
  } catch (err) {
    next(err);
  }
};

// exports.getUnitReviews = async (req, res, next) => {
//   const unitId = Number(req.params.id);

//   if (!Number.isInteger(unitId) || unitId <= 0) {
//     return next(new AppError("BAD_REQUEST", 400, "unitId is required"));
//   }

//   try {
//     const reviews = await unitsService.getUnitReviews(unitId);
//     return res.status(200).json(ApiRsponse(reviews, { itemCount: reviews.length}));
//   } catch (err) {
//     return next(err);
//   }
// };

// ----

exports.getDetail = async (req, res, next) => {
  // input validation
  const unitId = Number(req.params?.id);

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  // process
  try {
    const unit = await unitsService.getUnitById(unitId);
    res.status(200).json(new ApiResponse({unit}))
  } catch(err) {
    next(err);
  }
}

exports.update = async (req, res, next) => {
  // input validation
  const unitId = Number(req.params?.id);
  const {
    name,
    description,
    profileImage,
    detailUrl,
  } = req.body;
  const userId = req.user?.id;

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  if (name === undefined && description === undefined && profileImage === undefined && detailUrl === undefined) {
    return next(new CustomError("BAD_REQUEST", "nothing to udpate", 400));
  }

  if (!userId) {
    return next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  // processing
  try {
    const updatedUnit = await unitsService.update(unitId, userId, {
      name,
      description,
      profileImage,
      detailUrl
    });
    res.status(200).json(new ApiResponse({unit: updatedUnit}));
  } catch(err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  const userId = req.user?.id;
  const unitId = Number(req.params.id);

  if (!userId) {
    return next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  try {
    const data = await unitsService.delete(unitId, userId);
    res.status(200).json(new ApiResponse(data));
  } catch(err) {
    next(err);
  }
}

exports.addBusinessHour = async (req, res, next) => {
  const userId = req.user?.id;
  const unitId = Number(req.params.id);
  const payload = req.body;

  if (!userId) {
    return next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  if (!Array.isArray(payload?.operatingHours) || payload.operatingHours.length === 0) {
    return next(new CustomError("BAD_REQUEST", "businessHours must be a non-empty array", 400));
  }

  try {
    const data = await unitsService.addBusinessHour(unitId, userId, payload)
    res.status(201).json(new ApiResponse(data))
  } catch(err) {
    next(err)
  }
}

exports.putBusinessHour = async (req, res, next) => {
  const unitId = Number(req.params.id);
  const userId = Number(req.user?.id);
  const payload = req.body

  if (!userId) {
    return next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  if (!Array.isArray(payload?.operatingHours) || payload.operatingHours.length === 0) {
    return next(new CustomError("BAD_REQUEST", "businessHours must be a non-empty array", 400));
  }

  try {
    const data = await unitsService.replaceBusinessHour(unitId, userId, payload);
    res.status(200).json(new ApiResponse(data))
  } catch(err) {
    next(err)
  }
}

exports.createReservation = async (req, res, next) => {
  // unitId, userId, payload
  const unitId = Number(req.params.id);
  const userId = Number(req.user?.id);
  const {
    startTime,
    memo,
    headcount
  } = req.body

  if (!userId) {
    return next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  if (!startTime) {
    return next(new CustomError("BAD_REQUEST", "startTime is required", 400));
  }

  try {
    const data = await unitsService.createReservation({
      userId,
      unitId,
      startTime,
      memo,
      headcount,
    })
    return res.status(200).json(new ApiResponse(data));
  } catch(err) {
    return next(err)
  }
}

exports.getReviews = async (req, res, next) => {
  // unitId, page, limit
  const unitId = Number(req.params.id);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  if (!Number.isInteger(unitId) || unitId <= 0) {
    return next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  try {
    const {
      data,
      totalCount,
      totalPage
    } = await unitsService.getReviews(unitId, page, limit);
    return res.status(200).json(new ApiResponse(data, {
      page,
      limit,
      totalCount,
      totalPage
    }))

  } catch(err) {
    return next(err)
  }
}