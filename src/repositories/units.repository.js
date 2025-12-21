const {
  Unit,
  Reservation,
  OperatingHour,
  ReservationPolicy,
  StoreClosedDay,
  UnitClosedDay,
} = require("../models");
const { Op } = require("sequelize");


exports.create = (data) => {
  return Unit.create(data);
};

exports.findAll = () => {
  return Unit.findAll();
};

exports.findById = (id) => {
  return Unit.findByPk(id);
};

exports.update = async (id, data) => {
  await Unit.update(data, { where: { id } });
  return Unit.findByPk(id);
};

exports.remove = (id) => {
  return Unit.destroy({ where: { id } });
};


// availability 전용 조회
exports.findUnitWithPolicy = (unitId) => {
  return Unit.findByPk(unitId, {
    include: [{ model: ReservationPolicy }],
  });
};

exports.findOperatingHour = ({ policyId, dayOfWeek }) => {
  return OperatingHour.findOne({
    where: { policyId, dayOfWeek },
  });
};

exports.findReservationsOnDate = ({ unitId, start, end }) => {
  return Reservation.findAll({
    where: {
      unitId,
      startTime: { [Op.between]: [start, end] },
      status: { [Op.notIn]: ["CANCELED_BY_CUSTOMER", "CANCELED_BY_STORE"]},
    },
  });
};

exports.isClosedOnDate = async ({ storeId, unitId, date }) => {
  const storeClosed = await StoreClosedDay.findOne({
    where: { storeId, date },
  });
  if (storeClosed) return true;

  const unitClosed = await UnitClosedDay.findOne({
    where: { unitId, date },
  });
  return !!unitClosed;
};