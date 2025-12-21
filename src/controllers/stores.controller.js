const storesService = require("../services/stores.service");

exports.createStore = async (req, res, next) => {
  try {
    const store = await storesService.createStore(req.body);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
};

exports.getStores = async (req, res, next) => {
  try {
    const stores = await storesService.getStores();
    res.status(200).json(stores);
  } catch (err) {
    next(err);
  }
};

exports.getStoreById = async (req, res, next) => {
  try {
    const store = await storesService.getStoreById(req.params.storeId);
    res.status(200).json(store);
  } catch (err) {
    next(err);
  }
};

exports.updateStore = async (req, res, next) => {
  try {
    const store = await storesService.updateStore(
      req.params.storeId,
      req.body
    );
    res.status(200).json(store);
  } catch (err) {
    next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    await storesService.deleteStore(req.params.storeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
