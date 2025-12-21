const { Store } = require('../models');

async function create(data, options = {}) {
  return Store.create(data, options);
}

async function findById(id, options = {}) {
  return Store.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return Store.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return Store.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await Store.update(data, { where: { id }, ...options });
  return findById(id);
}

async function remove(id, options = {}) {
  return Store.destroy({ where: { id }, ...options });
}

async function restore(id, options = {}) {
  return Store.restore({ where: { id }, ...options });
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
