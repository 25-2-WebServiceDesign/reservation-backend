const { Favorite } = require('../models');

async function create(data, options = {}) {
  return Favorite.create(data, options);
}

async function findOne(where = {}, options = {}) {
  return Favorite.findOne({ where, ...options });
}

async function findByKeys(userId, storeId, options = {}) {
  return Favorite.findOne({ where: { userId, storeId }, ...options });
}

async function findAll(where = {}, options = {}) {
  return Favorite.findAll({ where, ...options });
}

async function removeByKeys(userId, storeId, options = {}) {
  return Favorite.destroy({ where: { userId, storeId }, ...options });
}

async function restoreByKeys(userId, storeId, options = {}) {
  return Favorite.restore({ where: { userId, storeId }, ...options });
}

module.exports = {
  create,
  findOne,
  findByKeys,
  findAll,
  removeByKeys,
  restoreByKeys,
};
