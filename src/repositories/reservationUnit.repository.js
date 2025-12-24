const { ReservationUnit } = require('../models');

async function create(data, options = {}) {
  return ReservationUnit.create(data, options);
}

async function findById(id, options = {}) {
  return ReservationUnit.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return ReservationUnit.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return ReservationUnit.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await ReservationUnit.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return ReservationUnit.destroy({ where: { id }, ...options });
}

async function restore(id, options = {}) {
  return ReservationUnit.restore({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
  restore,
};
