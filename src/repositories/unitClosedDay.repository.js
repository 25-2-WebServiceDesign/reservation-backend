const { UnitClosedDay } = require('../models');

async function create(data, options = {}) {
  return UnitClosedDay.create(data, options);
}

async function findById(id, options = {}) {
  return UnitClosedDay.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return UnitClosedDay.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return UnitClosedDay.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await UnitClosedDay.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return UnitClosedDay.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
