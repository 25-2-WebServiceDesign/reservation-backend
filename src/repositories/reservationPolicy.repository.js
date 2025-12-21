const { ReservationPolicy } = require('../models');

async function create(data, options = {}) {
  return ReservationPolicy.create(data, options);
}

async function findById(id, options = {}) {
  return ReservationPolicy.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return ReservationPolicy.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return ReservationPolicy.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await ReservationPolicy.update(data, { where: { id }, ...options });
  return findById(id);
}

async function remove(id, options = {}) {
  return ReservationPolicy.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
