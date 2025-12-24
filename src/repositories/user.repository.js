const { User } = require('../models');

async function create(data, options = {}) {
  return User.create(data, options);
}

async function findById(id, options = {}) {
  return User.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return User.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return User.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await User.update(data, { where: { id }, ...options });
  return findById(id, options);
}

async function remove(id, options = {}) {
  return User.destroy({ where: { id }, ...options });
}

async function restore(id, options = {}) {
  return User.restore({ where: { id }, ...options });
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
