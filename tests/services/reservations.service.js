const CustomError = require("../responses/customError");
const { Reservation, ReservationUnit, Store } = require("../models");

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

exports.getReservationById = async (userId, reservationId) => {
  const reservation = await Reservation.findOne({
    where: {
      id: reservationId,
      userId,
    },
  });

  if (!reservation) {
    throw new CustomError("NOT_FOUND", "Reservation not found", 404);
  }

  return reservationSafetyWrapper(reservation);
};


const ALLOWED_STATUSES = new Set(["PENDING", "CONFIRMED", "CANCELED"]);

function canTransition(from, to) {
  if (from === to) return true;
  if (from === "PENDING" && (to === "CONFIRMED" || to === "CANCELED")) return true;
  if (from === "CONFIRMED" && to === "CANCELED") return true;
  return false;
}

exports.updateReservationStatus = async (userId, reservationId, nextStatus) => {
  const status = String(nextStatus).toUpperCase();
  if (!ALLOWED_STATUSES.has(status)) {
    throw new CustomError("BAD_REQUEST", "invalid reservation status", 400);
  }

  // 본인 예약만 찾기 (타인 예약은 404로 숨김)
  const reservation = await Reservation.findOne({
    where: { id: reservationId, userId },
  });

  if (!reservation) {
    throw new CustomError("NOT_FOUND", "Reservation not found", 404);
  }

  const current = String(reservation.status).toUpperCase();

  if (!canTransition(current, status)) {
    throw new CustomError(
      "BAD_REQUEST",
      `cannot change status from ${current} to ${status}`,
      400
    );
  }

  // 멱등
  if (current === status) {
    return reservationSafetyWrapper(reservation);
  }

  reservation.status = status;
  await reservation.save();

  return reservationSafetyWrapper(reservation);
};

// owner 전용 상태 변경 함수
exports.updateReservationStatusByOwner = async(userId, reservationId, nextStatus) => {
  const status = String(nextStatus).toUpperCase();

  const reservation = await Reservation.findOne({
    where: {id: reservationId},
    include: [
      {
        model: ReservationUnit,
        include: [
          {
            model: Store
          }
        ]
      }
    ]
  })

  if (!reservation) {
    throw new CustomError("NOT_FOUND", "Reservation not found", 404);
  }

  const ownerId = reservation.ReservationUnit.Store.ownerId;

  if (Number(ownerId) !== Number(userId)) {
    throw new CustomError("NOT_FOUND", "Reservation not found", 404);
  }

  const current = reservation.status;

  if (current === status) {
    return reservationSafetyWrapper(reservation)
  }
  reservation.status = status;
  await reservation.save();

  return reservationSafetyWrapper(reservation);
}

exports.updateReservation = async (userId, reservationId, { memo, headcount }) => {
  const reservation = await Reservation.findOne({
    where: { id: reservationId, userId },
  });

  if (!reservation) {
    throw new CustomError("NOT_FOUND", "Reservation not found", 404);
  }

  if (reservation.status === "CANCELED") {
    throw new CustomError("BAD_REQUEST", "Canceled reservation cannot be updated", 400);
  }

  if (headcount !== undefined) {
    const hc = Number(headcount);
    if (!Number.isInteger(hc) || hc <= 0) {
      throw new CustomError("BAD_REQUEST", "headcount must be a positive integer", 400);
    }
    reservation.headcount = hc;
  }

  if (memo !== undefined) {
    reservation.memo = String(memo);
  }

  await reservation.save();
  return reservationSafetyWrapper(reservation);
};
