const CustomError = require("../responses/customError");
const { Reservation } = require("../models");

function reservationSafetyWrapper(r) {
  return {
    id: r.id,
    userId: r.userId,
    unitId: r.unitId,
    startTime: r.startTime,
    endTime: r.endTime,
    memo: r.memo,
    headcount: r.headcount,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

exports.getMyReservations = async (userId, { page = 1, limit = 10, order = "desc" } = {}) => {
  const p = Number(page);
  const l = Number(limit);
  const ord = String(order ?? "desc").toLowerCase();

  if (!Number.isInteger(p) || p <= 0) {
    throw new CustomError("BAD_REQUEST", "page must be a positive integer", 400);
  }
  if (!Number.isInteger(l) || l <= 0 || l > 100) {
    throw new CustomError("BAD_REQUEST", "limit must be 1~100", 400);
  }
  if (ord !== "asc" && ord !== "desc") {
    throw new CustomError("BAD_REQUEST", "order must be asc or desc", 400);
  }

  const offset = (p - 1) * l;
  const direction = ord === "asc" ? "ASC" : "DESC";

  const { rows, count } = await Reservation.findAndCountAll({
    where: { userId },
    limit: l,
    offset,
    order: [["startTime", direction]],
  });

  return {
    data: rows.map(reservationSafetyWrapper),
    totalCount: count,
    totalPage: Math.ceil(count / l),
  };
};
