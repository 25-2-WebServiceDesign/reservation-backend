const { Op } = require("sequelize");
const storesRepository = require("../repositories/store.repository");
const reservationRepository = require("../repositories/reservation.reposiory");
const reviewRepository = require("../repositories/revicw.repository");
const AppError = require("../responses/AppError");

exports.createStore = async (data) => {
  if (!data.name) {
    throw new AppError("VALIDATION_ERROR", 400, "Store name is required");
  }
  return storesRepository.create(data);
};

exports.getStores = async () => {
  return storesRepository.findAll();
};

exports.getStoreById = async (storeId) => {
  const store = await storesRepository.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  return store;
};

exports.updateStore = async (storeId, data) => {
  const store = await storesRepository.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  return storesRepository.update(storeId, data);
};

exports.deleteStore = async (storeId) => {
  // const store = await storesRepository.findById(storeId);
  // if (!store) {
  //   throw new AppError("NOT_FOUND", 404, "Store not found");
  // }
  const affected = await storesRepository.remove(storeId);
  
  if (affected === 0) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
};

exports.getStoreReviews = async (storeId) => {
  const store = await storesRepository.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  const reservations = await reservationRepository.findAll(
    { storeId },
    { attributes: ["id"] }
  );

  if (!reservations || reservations.length === 0) return [];

  const reservationIds = reservations.map((r) => r.id);

  const reviews = await reviewRepository.findAll({
    reservationId: { [Op.in]: reservationIds },
  });

  return reviews;
};