const { Review } = require('../models');

async function create(data, options = {}) {
  return Review.create(data, options);
}

async function findById(id, options = {}) {
  return Review.findByPk(id, options);
}

async function findOne(where = {}, options = {}) {
  return Review.findOne({ where, ...options });
}

async function findAll(where = {}, options = {}) {
  return Review.findAll({ where, ...options });
}

async function update(id, data, options = {}) {
  await Review.update(data, { where: { id }, ...options });
  return findById(id);
}

async function remove(id, options = {}) {
  return Review.destroy({ where: { id }, ...options });
}

async function restore(id, options = {}) {
  return Review.restore({ where: { id }, ...options });
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
