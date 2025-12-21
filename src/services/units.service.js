const unitsRepository = require("../repositories/units.repository");
const storesRepository = require("../repositories/stores.repository");
const AppError = require("../errors/AppError");

// Unit 생성 시 Store 존재 검증 필수

exports.createUnit = async (data) => {
  if (!data.storeId) {
    throw new AppError("VALIDATION_ERROR", 400, "storeId is required");
  }

  const store = await storesRepository.findById(data.storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  return unitsRepository.create(data);
};

exports.getUnits = async () => {
  return unitsRepository.findAll();
};

exports.getUnitById = async (unitId) => {
  const unit = await unitsRepository.findById(unitId);
  if (!unit) {
    throw new AppError("NOT_FOUND", 404, "Unit not found");
  }
  return unit;
};

exports.updateUnit = async (unitId, data) => {
  const unit = await unitsRepository.findById(unitId);
  if (!unit) {
    throw new AppError("NOT_FOUND", 404, "Unit not found");
  }

  return unitsRepository.update(unitId, data);
};

exports.deleteUnit = async (unitId) => {
  const unit = await unitsRepository.findById(unitId);
  if (!unit) {
    throw new AppError("NOT_FOUND", 404, "Unit not found");
  }

  await unitsRepository.remove(unitId);
};

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function toHHMM(d) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function addMinutes(d, min) {
  return new Date(d.getTime() + min * 60 * 1000);
}

// "YYYY-MM-DD" + "HH:mm" 를 KST로 Date 생성
function kstDateTime(date, hhmm) {
  return new Date(`${date}T${hhmm}:00+09:00`);
}

function dayOfWeekEnumKST(date) {
  const n = new Date(`${date}T00:00:00+09:00`).getDay(); // 0~6
  const map = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return map[n];
}

function isOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}


exports.getUnitAvailability = async ({ unitId, date }) => {
  // 1) 유닛 + 정책 로드
  const unit = await unitsRepository.findUnitWithPolicy(unitId);
  if (!unit) {
    throw new AppError("NOT_FOUND", 404, "Unit not found");
  }

  // storeId 필드명 안전 처리
  const storeId = pick(unit, ["storeId", "store_id"]);
  if (!storeId) {
    throw new AppError("DATA_ERROR", 500, "Unit.storeId is missing");
  }

  // 2) 휴무 체크
  const isClosed = await unitsRepository.isClosedOnDate({
    storeId,
    unitId,
    date,
  });

  if (isClosed) {
    return { unitId, date, timezone: "Asia/Seoul", slots: [] };
  }

  // 3) 정책/운영시간 로드
  const unitPolicy = unit.ReservationPolicy;
  const policyId = unitPolicy?.id;

  if (!policyId) {
    return { unitId, date, timezone: "Asia/Seoul", slots: [] };
  }

  const dayOfWeek = dayOfWeekEnumKST(date);
  const operatingHour = await unitsRepository.findOperatingHour({
    policyId,
    dayOfWeek,
  });

  if (!operatingHour) {
    return { unitId, date, timezone: "Asia/Seoul", slots: [] };
  }

  // 운영시간
  const openTime = pick(operatingHour, ["openTime", "open_time", "startTime", "start_time"]);
  const closeTime = pick(operatingHour, ["closeTime", "close_time", "endTime", "end_time"]);

  if (!openTime || !closeTime) {
    throw new AppError("DATA_ERROR", 500, "OperatingHour time fields missing");
  }

  // 4) 슬롯 정책
  const slotIntervalMin =
    Number(pick(unitPolicy, ["slotIntervalMin", "slot_interval_min", "slot_interval"])) || 30;

  const durationMin =
    Number(pick(unitPolicy, ["durationMin", "duration_min", "duration"])) || slotIntervalMin;

  // 5) 예약 로드(해당 날짜 범위)
  const rangeStart = new Date(`${date}T00:00:00+09:00`);
  const rangeEnd = new Date(`${date}T23:59:59+09:00`);

  const reservations = await unitsRepository.findReservationsOnDate({
    unitId,
    start: rangeStart,
    end: rangeEnd,
  });

  const reservedRanges = (reservations || []).map((r) => ({
    start: new Date(r.startTime),
    end: new Date(r.endTime),
  }));

  // 6) 슬롯 생성
  const dayStart = kstDateTime(date, openTime);
  const dayEnd = kstDateTime(date, closeTime);

  if (!(dayStart < dayEnd)) {
    return { unitId, date, timezone: "Asia/Seoul", slotIntervalMin, durationMin, slots: [] };
  }

  const slots = [];
  for (
    let t = new Date(dayStart);
    addMinutes(t, durationMin) <= dayEnd;
    t = addMinutes(t, slotIntervalMin)
  ) {
    const slotStart = new Date(t);
    const slotEnd = addMinutes(slotStart, durationMin);

    const overlapped = reservedRanges.some(({ start, end }) =>
      isOverlap(slotStart, slotEnd, start, end)
    );

    slots.push({
      time: toHHMM(slotStart),
      available: !overlapped,
    });
  }

  return {
    unitId,
    date,
    timezone: "Asia/Seoul",
    slotIntervalMin,
    durationMin,
    slots,
  };
};
