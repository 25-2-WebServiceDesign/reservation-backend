const { Op } = require("sequelize");
const { Store } = require("../models");
const { storeRepo, reservationRepo, reservationUnitRepo, reviewRepo, favoriteRepo } = require("../repositories")

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

exports.getStoreUnits = async (storeId, { page = 1, limit = 20, order = "desc" } = {}) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const p = Number(page);
  const l = Number(limit);

  if (!Number.isInteger(p) || p <= 0) {
    throw new AppError("BAD_REQUEST", 400, "page must be a positive integer");
  }
  if (!Number.isInteger(l) || l <= 0 || l > 100) {
    throw new AppError("BAD_REQUEST", 400, "limit must be 1~100");
  }

  const ord = String(order || "desc").toLowerCase();
  if (ord !== "asc" && ord !== "desc") {
    throw new AppError("BAD_REQUEST", 400, "order must be asc or desc");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  const offset = (p - 1) * l;

  const units = await reservationUnitRepo.findAll(
    { storeId: id },
    {
      limit: l,
      offset,
      order: [["id", ord.toUpperCase()]],
    }
  );

  return units;
};

exports.createStoreUnit = async (storeId, data, user) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  if (user?.role !== "ADMIN" && store.ownerId !== user?.id) {
    throw new AppError("FORBIDDEN", 403, "No permission to create unit for this store");
  }

  const payload = {
    ...data,
    storeId: id,
  };

  if (!payload.name) {
    throw new AppError("VALIDATION_ERROR", 400, "name is required");
  }

  if(!payload.description) {
    throw new AppError("VALIDATION_ERROR", 400, "description is required");
  }

  const unit = await reservationUnitRepo.create(payload);
  return unit;
};

exports.getStoreReservations = async (storeId, { page = 1, limit = 10, order = "desc" } = {}) => {
  if (!Number.isInteger(page) || page <= 0) page = 1;
  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) limit = 10;
  if (!["asc", "desc"].includes(order)) order = "desc";

  const store = await storeRepo.findById(storeId);
  if (!store) throw new AppError("NOT_FOUND", 404, "Store not found");

  const units = await reservationUnitRepo.findAll(
    { storeId },
    { attributes: ["id"] }
  );
  if (!units || units.length === 0) return [];

  const unitIds = units.map(u => u.id);

  const offset = (page - 1) * limit;

  const reservations = await reservationRepo.findAll(
    { unitId: { [Op.in]: unitIds } },
    {
      limit,
      offset,
      order: [["id", order.toUpperCase()]],
    }
  );

  return reservations;
};

exports.getStoreReviews = async (storeId, { page = 1, limit = 10, order = "desc" } = {}) => {
  if (!Number.isInteger(page) || page <= 0) page = 1;
  if (!Number.isInteger(limit) || limit <= 0 || limit > 100) limit = 10;
  if (!["asc", "desc"].includes(order)) order = "desc";

  const store = await storeRepo.findById(storeId);
  if (!store) throw new AppError("NOT_FOUND", 404, "Store not found");

  const units = await reservationUnitRepo.findAll(
    { storeId },
    { attributes: ["id"] }
  );
  if (!units || units.length === 0) return [];

  const unitIds = units.map(u => u.id);

  const reservations = await reservationRepo.findAll(
    { unitId: { [Op.in]: unitIds } },
    { attributes: ["id"] }
  );
  if (!reservations || reservations.length === 0) return [];

  const reservationIds = reservations.map(r => r.id);

  const offset = (page - 1) * limit;

  const reviews = await reviewRepo.findAll(
    { reservationId: { [Op.in]: reservationIds } },
    {
      limit,
      offset,
      order: [["id", order.toUpperCase()]],
    }
  );

  return reviews;
};

// favorite 가게 추가 (멱등)
exports.addFavorite = async (userId, storeId) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  const existing = await favoriteRepo.findByKeys(userId, id, { paranoid: false });

  if (!existing) {
    const created = await favoriteRepo.create({ userId, storeId: id });
    return created;
  }

  if (existing.deletedAt) {
    await favoriteRepo.restoreByKeys(userId, id);
    const restored = await favoriteRepo.findByKeys(userId, id);
    return restored;
  }

  return existing;
};

exports.removeFavorite = async (userId, storeId) => {
  const id = Number(storeId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("BAD_REQUEST", 400, "storeId is invalid");
  }

  const store = await storeRepo.findById(id);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }

  await favoriteRepo.removeByKeys(userId, id);
};