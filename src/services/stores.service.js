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
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await Store.findByPk(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "store not found");
  }

  return store;
};

/*
exports.updateStore = async (storeId, data) => {
  const store = await storeRepo.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  return storeRepo.update(storeId, data);
};
*/

exports.deleteStore = async (storeId, user) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  // OWNER는 본인 가게만 / ADMIN은 예외
  if (user?.role !== "ADMIN" && store.ownerId !== user?.id) {
    throw new AppError("FORBIDDEN", 403, "No permission to delete this store");
  }

  await storeRepo.remove(id);
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

exports.patchStore = async (storeId, data, user) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  // 소유자(OWNER)만 수정 가능, ADMIN은 예외 허용
  if (user?.role !== "ADMIN" && store.ownerId !== user?.id) {
    throw new AppError("FORBIDDEN", 403, "No permission to update this store");
  }

  // 허용 필드만 부분 업데이트 (ownerId는 절대 수정 불가)
  const allowedFields = ["name", "address", "phone", "category", "homepageUrl", "detail"];
  const patch = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) patch[key] = data[key];
  }

  if (Object.keys(patch).length === 0) {
    throw new AppError("VALIDATION_ERROR", 400, "No valid fields to update");
  }

  return storeRepo.update(id, patch);
};