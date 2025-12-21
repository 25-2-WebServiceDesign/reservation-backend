const { OperatingHour } = require('../models');

async function create(data, options = {}) {
  return OperatingHour.create(data, options);
}

async function findById(id, options = {}) {
  return OperatingHour.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return OperatingHour.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return OperatingHour.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await OperatingHour.update(data, { where: { id }, ...options });
  return findById(id);
}

async function remove(id, options = {}) {
  return OperatingHour.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
