const storesRepository = require("../repositories/stores.repository");
const AppError = require("../errors/AppError");

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
  const store = await storesRepository.findById(storeId);
  if (!store) {
    throw new AppError("NOT_FOUND", 404, "Store not found");
  }
  await storesRepository.remove(storeId);
};
