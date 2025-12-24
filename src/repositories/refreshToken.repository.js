const { RefreshToken } = require('../models');

async function create(data, options = {}) {
  return RefreshToken.create(data, options);
}

async function findById(id, options = {}) {
  return RefreshToken.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return RefreshToken.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return RefreshToken.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await RefreshToken.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return RefreshToken.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
