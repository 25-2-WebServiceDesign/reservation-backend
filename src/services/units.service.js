const { sequelize, Sequelize } = require("../models");

const CustomError = require("../responses/customError")

const {reservationUnitRepo, storeRepo, reservationPolicyRepo, operatingHourRepo, reservationRepo} = require("../repositories")

const { Op } = require("sequelize");
// 소유 확인하는 메서드
async function verifyUnitOwner(unitId, userId, transaction = null) {
  const unit = await reservationUnitRepo.findById(unitId, {transaction});

  if (!unit) {
    throw new CustomError("NOT_FOUND", "can't find unit", 404);
  }

  const store = await storeRepo.findById(unit.storeId, {transaction});

  if (!store) {
    throw new CustomError("NOT_FOUND", "store not found", 404);
  }

  if (Number(store.ownerId) !== Number(userId)) {
    throw new CustomError("FORBIDDEN", "unit can edit only for store owner", 403);
  }
}

// 사용중
exports.getUnitById = async (unitId) => {
  const unit = await reservationUnitRepo.findById(unitId);
  if (!unit) {
    throw new CustomError("NOT_FOUND", "Unit not found", 404);
  }
  return unit;
};

exports.update = async (unitId, userId, newData) => {
  const transaction = await sequelize.transaction()

  try {
    await verifyUnitOwner(unitId, userId, transaction)

    // update
    const updatedUnit = await reservationUnitRepo.update(unitId, newData, {transaction});

    await transaction.commit()
    return updatedUnit;
  } catch(err) {
    await transaction.rollback();
    throw err;
  }
}

exports.delete = async (unitId, userId) => {
  const transaction = await sequelize.transaction()

  try {
    await verifyUnitOwner(unitId, userId, transaction);

    // 삭제
    const affected = await reservationUnitRepo.remove(unitId, {transaction});
    
    if (affected === 0) {
      throw new CustomError("NOT_FOUND", "reservationUnit not found", 404);
    }

    await transaction.commit();
    return {message: "reservationUnit delete succeed"};
  } catch(err) {
    await transaction.rollback()
    throw err;
  }
}

exports.addBusinessHour = async (unitId, userId, payload) => {
  const transaction = await sequelize.transaction();

  try {
    await verifyUnitOwner(unitId, userId, transaction);

    const reservationPolicy = await reservationPolicyRepo.findOne({unitId}, {transaction});

    if (reservationPolicy) {
      throw new CustomError("CONFLICT", "reservationPolicy is already exist", 409)
    }

    // business Policy 생성
    const policyData = {
      unitId,
      slotDuration: payload.slotDuration,
      maximumHeadcount: payload.maximumHeadcount,
    }
    const policy = await reservationPolicyRepo.create(policyData, {transaction});

    // operating Hour 생성
    const operatingHours = payload.operatingHours;

    await Promise.all(
      operatingHours.map(hour =>
        operatingHourRepo.create(
          {
            ...hour,
            policyId: policy.id,
          },
          { transaction }
        )
      )
    );

    const hours = await operatingHourRepo.findAll({policyId: policy.id}, {transaction})

    await transaction.commit()
    return {
      ...policy.get({plain: true}),
      operatingHours: hours
    }
  } catch(err) {
    await transaction.rollback()
    throw err;
  }
}

exports.replaceBusinessHour = async (unitId, userId, payload) => {
  const transaction = await sequelize.transaction()

  try {
    await verifyUnitOwner(unitId, userId, transaction);

    // 존재 확인
    const reservationPolicy = await reservationPolicyRepo.findOne({unitId}, {transaction});

    if (!reservationPolicy) {
      throw new CustomError("NOT_FOUND", "reservationPolicy is not founded", 404)
    }
    const affected = await reservationPolicyRepo.remove(reservationPolicy.id, {transaction});

    if (affected === 0) {
      throw new CustomError("NOT_FOUND", "reservationPolicy is not founded", 404)
    }

    // business Policy 생성
    const policyData = {
      unitId,
      slotDuration: payload.slotDuration,
      maximumHeadcount: payload.maximumHeadcount,
    }
    const policy = await reservationPolicyRepo.create(policyData, {transaction});

    // operating Hour 생성
    const operatingHours = payload.operatingHours;

    await Promise.all(
      operatingHours.map(hour =>
        operatingHourRepo.create(
          {
            ...hour,
            policyId: policy.id,
          },
          { transaction }
        )
      )
    );

    const hours = await operatingHourRepo.findAll({policyId: policy.id}, {transaction})

    await transaction.commit()
    return {
      ...policy.get({plain: true}),
      operatingHours: hours
    }
  } catch(err) {
    await transaction.rollback();
    throw err;
  }
}

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

exports.getUnitAvailability = async ({ unitId, date }) => {
  // unit 확인
  const unit = await reservationUnitRepo.findById(unitId);
  if (!unit) {
    throw new CustomError("NOT_FOUND", "unit not found", 404);
  }

  // policy 확인
  const policy = await reservationPolicyRepo.findOne({ unitId });
  if (!policy) return [];

  const slotDuration = policy.slotDuration;

  // 요일 계산
  const targetDate = new Date(`${date}T00:00:00+09:00`);
  const dayOfWeekMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = dayOfWeekMap[targetDate.getDay()];

  // 운영시간
  const operatingHour = await operatingHourRepo.findOne({
    policyId: policy.id,
    dayOfWeek,
  });
  if (!operatingHour) return [];

  // 날짜 범위 계산 (KST)
  const startOfDay = new Date(`${date}T00:00:00+09:00`);
  const endOfDay = new Date(`${date}T23:59:59+09:00`);

  // 예약 조회
  const reservations = await reservationRepo.findAll({
    unitId,
    status: { [Op.in]: ["PENDING", "CONFIRMED"] },
    startTime: { [Op.between]: [startOfDay, endOfDay] },
  });

  // 분 단위 변환
  const openMinutes = toMinutes(operatingHour.openTime);
  const closeMinutes = toMinutes(operatingHour.closeTime);

  const reservedRanges = reservations.map(r => ({
    start: toMinutes(r.startTime.toISOString().slice(11, 16)),
    end: toMinutes(r.endTime.toISOString().slice(11, 16)),
  }));

  // 슬롯 생성
  const availableSlots = [];

  for (
    let t = openMinutes;
    t + slotDuration <= closeMinutes;
    t += slotDuration
  ) {
    const overlap = reservedRanges.some(
      r => t < r.end && t + slotDuration > r.start
    );

    if (!overlap) {
      availableSlots.push(toTimeString(t));
    }
  }

  // 오늘이면 과거 시간 제거
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (date === todayStr) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return availableSlots.filter(t => toMinutes(t) > nowMinutes);
  }

  return availableSlots;
};
