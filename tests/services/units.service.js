const { sequelize, Sequelize, Reservation } = require("../models");

const CustomError = require("../responses/customError")

const {reservationUnitRepo, storeRepo, reservationPolicyRepo, operatingHourRepo, reservationRepo, reviewRepo} = require("../repositories")

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

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

async function assertReservable({
  unitId,
  startTime,
  headcount = 1,
  transaction = null,
}) {
  const kstDate = new Date(
    startTime.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  // 1. unit
  const unit = await reservationUnitRepo.findById(unitId, { transaction });
  if (!unit) {
    throw new CustomError("NOT_FOUND", "unit not found", 404);
  }

  // 2. policy
  const policy = await reservationPolicyRepo.findOne(
    { unitId },
    { transaction }
  );
  if (!policy) {
    throw new CustomError("FORBIDDEN", "reservation policy not found", 403);
  }

  const slotDuration = policy.slotDuration;
  const maximumHeadcount = policy.maximumHeadcount;

  if (headcount > maximumHeadcount) {
    throw new CustomError(
      "BAD_REQUEST",
      "headcount exceeds maximumHeadcount",
      400
    );
  }

  // 3. 요일
  const dayOfWeekMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = dayOfWeekMap[kstDate.getDay()];


  // 4. 운영시간
  const operatingHour = await operatingHourRepo.findOne(
    {
      policyId: policy.id,
      dayOfWeek,
    },
    { transaction }
  );

  if (!operatingHour) {
    throw new CustomError("FORBIDDEN", "unit is not operating", 403);
  }

  // 5. 시간 범위 계산
  const startMinutes =
    kstDate.getHours() * 60 + kstDate.getMinutes();
  const endMinutes = startMinutes + slotDuration;

  const openMinutes = toMinutes(operatingHour.openTime);
  const closeMinutes = toMinutes(operatingHour.closeTime);

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    throw new CustomError(
      "BAD_REQUEST",
      "reservation time is out of operating hours",
      400
    );
  }

  // 6. 같은 시간대 예약 충돌 확인
  const endTime = new Date(kstDate);
  endTime.setMinutes(endTime.getMinutes() + slotDuration);

  const overlapped = await reservationRepo.findOne(
    {
      unitId,
      status: { [Op.in]: ["PENDING", "CONFIRMED"] },
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: kstDate },
    },
    { transaction }
  );

  if (overlapped) {
    throw new CustomError(
      "CONFLICT",
      "reservation time already occupied",
      409
    );
  }

  return {
    unit,
    policy,
    startTime,
    endTime,
  };
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


exports.getUnitAvailability = async ({ unitId, date }) => {
  const unit = await reservationUnitRepo.findById(unitId);
  if (!unit) {
    throw new CustomError("NOT_FOUND", "unit not found", 404);
  }

  const policy = await reservationPolicyRepo.findOne({ unitId });
  if (!policy) return [];

  const slotDuration = policy.slotDuration;

  const targetDate = new Date(`${date}T00:00:00+09:00`);
  const dayOfWeekMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = dayOfWeekMap[targetDate.getDay()];

  const operatingHour = await operatingHourRepo.findOne({
    policyId: policy.id,
    dayOfWeek,
  });
  if (!operatingHour) return [];

  const startOfDay = new Date(`${date}T00:00:00+09:00`);
  const endOfDay = new Date(`${date}T23:59:59+09:00`);

  // 🔥 핵심 수정
  const reservations = await reservationRepo.findAll({
    unitId,
    status: { [Op.in]: ["PENDING", "CONFIRMED"] },
    startTime: { [Op.lt]: endOfDay },
    endTime: { [Op.gt]: startOfDay },
  });

  const reservedRanges = reservations.map(r => ({
    start: r.startTime.getHours() * 60 + r.startTime.getMinutes(),
    end: r.endTime.getHours() * 60 + r.endTime.getMinutes(),
  }));

  const openMinutes = toMinutes(operatingHour.openTime);
  const closeMinutes = toMinutes(operatingHour.closeTime);

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

  // 오늘이면 과거 제거
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (date === todayStr) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return availableSlots.filter(t => toMinutes(t) > nowMinutes);
  }

  return availableSlots;
};

exports.createReservation = async ({userId, unitId, startTime, memo, headcount}) => {
  const transaction = await sequelize.transaction();

  try {
    const start = new Date(startTime);

    const { endTime } = await assertReservable({
      unitId,
      startTime: start,
      headcount,
      transaction,
    });

    const reservation = await reservationRepo.create(
      {
        userId,
        unitId,
        startTime: start,
        endTime,
        memo,
        headcount,
        status: "PENDING",
      },
      { transaction }
    );

    await transaction.commit();
    return reservation;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

exports.getReviews = async (unitId, page = 1, limit = 5) => {
  // 1. unit 존재 확인
  const unit = await reservationUnitRepo.findById(unitId);
  if (!unit) {
    throw new CustomError("NOT_FOUND", "unit not found", 404);
  }

  // 2. pagination 계산
  const offset = (page - 1) * limit;

  // 3. 리뷰 조회 (Reservation JOIN)
  const { rows, count } = await reviewRepo.findAndCountAll({
    where: {
      deletedAt: null,
    },
    include: [
      {
        model: Reservation,
        attributes: [], // reservation 데이터는 응답에 포함 안 함
        where: {
          unitId,
        },
        required: true, // INNER JOIN
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const totalPage = Math.ceil(count / limit);

  return {
    data: rows,
    totalCount: count,
    totalPage,
  };
};
