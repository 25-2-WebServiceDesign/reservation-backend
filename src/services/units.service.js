const { sequelize } = require("../models");

const CustomError = require("../responses/customError")

const {reservationUnitRepo, storeRepo, reservationPolicyRepo, operatingHourRepo} = require("../repositories")

// const { Op } = require("sequelize");
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