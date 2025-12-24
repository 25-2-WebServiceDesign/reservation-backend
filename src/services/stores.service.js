const { Op } = require("sequelize");
const { Store } = require("../models");
const {storeRepo, reservationRepo, reviewRepo} = require("../repositories")

const AppError = require("../responses/AppError");

exports.createStore = async (data) => {
  if (!data.name) {
    throw new AppError("VALIDATION_ERROR", 400, "Store name is required");
  }
  return storeRepo.create(data);
};

exports.getStores = async () => {
  return storeRepo.findAll();
};

exports.getStoreById = async (storeId) => {
  const store = await storeRepo.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  return store;
};

exports.updateStore = async (storeId, data) => {
  const store = await storeRepo.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  return storeRepo.update(storeId, data);
};

exports.deleteStore = async (storeId) => {
  // const store = await storeRepo.findById(storeId);
  // if (!store) {
  //   throw new AppError("NOT_FOUND", 404, "Store not found");
  // }
  const affected = await storeRepo.remove(storeId);
  
  if (affected === 0) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
};

exports.getStoreReviews = async (storeId) => {
  const store = await storeRepo.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  const reservations = await reservationRepo.findAll(
    { storeId },
    { attributes: ["id"] }
  );

  if (!reservations || reservations.length === 0) return [];

  const reservationIds = reservations.map((r) => r.id);

  const reviews = await reviewRepo.findAll({
    reservationId: { [Op.in]: reservationIds },
  });

  return reviews;
};

exports.getMyStores = async (ownerId) => {
  if (!ownerId) {
    throw new AppError("BAD_REQUEST", 400, "ownerId is required");
  }

  const stores = await Store.findAll({
    where: { ownerId },
    order: [["id", "DESC"]],
  });

  return stores;
};