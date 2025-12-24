const storesService = require("../services/stores.service");

exports.createStore = async (req, res, next) => {
  try {
    const payload = { ...req.body, ownerId: req.user.id };
    const store = await storesService.createStore(payload);
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

/*
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
*/

exports.deleteStore = async (req, res, next) => {
  try {
    await storesService.deleteStore(req.params.storeId, req.user);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getStoreReviews = async (req, res, next) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    return next(new AppError("BAD_REQUEST", 400, "storeId is required"));
  }

  try {
    const reviews = await storesService.getStoreReviews(storeId);
    return res.status(200).json(reviews);
  } catch (err) {
    return next(err);
  }
};

exports.getMyStores = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const stores = await storesService.getMyStores(ownerId);
    return res.status(200).json(stores);
  } catch (err) {
    next(err);
  }
};

exports.patchStore = async (req, res, next) => {
  try {
    const updated = await storesService.patchStore(
      req.params.storeId,
      req.body,
      req.user
    );
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};