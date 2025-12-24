const { UserAuth } = require('../models');

async function create(data, options = {}) {
  return UserAuth.create(data, options);
}

async function findById(id, options = {}) {
  return UserAuth.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return UserAuth.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return UserAuth.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await UserAuth.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return UserAuth.destroy({ where: { id }, ...options });
}

module.exports = {
  create,
  findById,
  findOne,
  findAll,
  update,
  remove,
};
