const { sequelize } = require("../models");

const CustomError = require("../responses/customError")

const {reservationUnitRepo, storeRepo} = require("../repositories")

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
      throw new CustomError("NOT_FOUND", "store not found", 404);
    }

    await transaction.commit();
    return {message: "reservationUnit delete succeed"};
  } catch(err) {
    await transaction.rollback()
    throw err;
  }
}