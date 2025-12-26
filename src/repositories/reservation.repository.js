const { Reservation } = require('../models');

async function create(data, options = {}) {
  return Reservation.create(data, options);
}

async function findById(id, options = {}) {
  return Reservation.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return Reservation.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return Reservation.findAll({ where, ...options });
}

async function findAndCountAll(options = {}) {
  return Reservation.findAndCountAll(options)
}

async function update(id, data, options = {}) {
  await Reservation.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return Reservation.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  findAndCountAll,
  update,
  remove,
};
