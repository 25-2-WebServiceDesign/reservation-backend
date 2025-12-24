const { StoreClosedDay } = require('../models');

async function create(data, options = {}) {
  return StoreClosedDay.create(data, options);
}

async function findById(id, options = {}) {
  return StoreClosedDay.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return StoreClosedDay.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return StoreClosedDay.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await StoreClosedDay.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return StoreClosedDay.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
