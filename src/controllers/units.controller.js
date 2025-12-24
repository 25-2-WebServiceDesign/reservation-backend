// const AppError = require("../responses/AppError");
const ApiResponse = require("../responses/ApiResponse");
const CustomError = require("../responses/customError");

const unitsService = require("../services/units.service");

// exports.createUnit = async (req, res, next) => {
//   // 입력 검증
//   const unitData = req.body || {};

//   if (!unitData) {
//     const err = new AppError("BAD_REQUEST", 400, "Unit data is required");
//     next(err)
//   }

//   if (!unitData.storeId || !unitData.name || !unitData.description) {
//     const err = new AppError("BAD_REQUEST", 400, "unitData needs 'storeId', 'name', 'description'");
//     next(err)
//   }

//   // 연산
//   try {
//     const unit = await unitsService.createUnit(unitData);
//     return res.status(201).json(ApiResponse(unit));
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getUnits = async (req, res, next) => {
//   try {
//     const units = await unitsService.getUnits();
//     return res.status(200).json(ApiResponse(units, {itemCount: units.length}));
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getUnitById = async (req, res, next) => {
//   // 입력 검증
//   const unitId = req.params?.unitId;

//   if (!unitId) {
//     next(new AppError("BAD_REQUEST", 400, "unitId is required"));
//   }

//   // process
//   try {
//     const unit = await unitsService.getUnitById(unitId);
//     return res.status(200).json(ApiResponse(unit));
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateUnit = async (req, res, next) => {
//   // input validation
//   const unitId = req.params.unitId;
//   const newData = req.body;

//   if (!unitId) {
//     next(new AppError("BAD_REQUEST", 400, "unitId is required"));
//   }

//   if (!newData) {
//     next(new AppError("BAD_REQUEST", 400, "nothing to update"));
//   }

//   // process
//   try {
//     const unit = await unitsService.updateUnit(
//       unitId,
//       newData
//     );
//     res.status(200).json(unit);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteUnit = async (req, res, next) => {
//   // input validation
//   const { unitId } = req.params;

//   if (!unitId) {
//     next(new AppError("BAD_REQUEST", 400, "unitId is required"));
//   }

//   // processing
//   try {
//     await unitsService.deleteUnit(unitId);
//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// };

// function isValidDateYYYYMMDD(dateStr) {
//   if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

//   const d = new Date(`${dateStr}T00:00:00+09:00`);
//   if (Number.isNaN(d.getTime())) return false;

//   const [y, m, day] = dateStr.split("-").map(Number);

//   return (
//     d.getFullYear() === y &&
//     d.getMonth() + 1 === m &&
//     d.getDate() === day
//   );
// }


// exports.getUnitAvailability = async (req, res, next) => {
//   // input validation
//   const unitId = Number(req.params.id);
//   const { date } = req.query;

//   if (!Number.isInteger(unitId) || unitId < 0) {
//     next(new AppError("BAD_REQUEST", 400, "unitId is required"));
//   }

//   if (!isValidDateYYYYMMDD(date)) {
//     next(new AppError("BAD_REQUEST", 400, "Invalid date (YYYY-MM-dd)"));
//   }

//   // process
//   try {
//     // const unitId = Number(unitId);
//     // const { date } = req.query;

//     // if (!unitId || Number.isNaN(unitId)) {
//     //   return res.status(400).json({ message: "Invalid unitId" });
//     // }
//     // if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//     //   return res.status(400).json({ message: "Invalid date (YYYY-MM-DD)" });
//     // }

//     const result = await unitsService.getUnitAvailability({ unitId, date });
//     return res.status(200).json(ApiResponse(result));
//   } catch (err) {
//     next(err);
//   }
// };
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
    next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
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
    next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  if (name === undefined && description === undefined && profileImage === undefined && detailUrl === undefined) {
    next(new CustomError("BAD_REQUEST", "nothing to udpate", 400));
  }

  if (!userId) {
    next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  // processing
  try {
    const updatedUnit = await unitsService.update(unitId, userId, {
      name,
      description,
      profileImage,
      detailUrl
    });
    res.statis(200).json(new ApiResponse({unit: updatedUnit}));
  } catch(err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  const userId = req.user?.id;
  const unitId = Number(req.params.id);

  if (!userId) {
    next(new CustomError("UNAUTHORIZED", "user not found", 401));
  }

  if (!Number.isInteger(unitId) || unitId <= 0) {
    next(new CustomError("BAD_REQUEST", "unitId is invalid", 400));
  }

  try {
    const data = await unitsService.delete(unitId, userId);
    res.status(200).json(data);
  } catch(err) {
    next(err);
  }


}