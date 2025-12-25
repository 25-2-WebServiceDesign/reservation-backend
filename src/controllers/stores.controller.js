const storesService = require("../services/stores.service");
const AppError = require("../responses/AppError");
const ApiResponse = require("../responses/ApiResponse");

exports.createStore = async (req, res, next) => {
  try {
    const payload = { ...req.body, ownerId: req.user.id };
    const store = await storesService.createStore(payload);
    res.status(201).json({store});
  } catch (err) {
    next(err);
  }
};

exports.getStores = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  try {
    const {data, totalCount, totalPage} = await storesService.getStores(page, limit);
    res.status(200).json(new ApiResponse({stores: data}, {
      page,
      limit,
      totalCount,
      totalPage
    }));
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
    return next(new AppError("BAD_REQUEST", 400, "storeId is invalid"));
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const order = String(req.query.order ?? "desc").toLowerCase(); // asc/desc

  try {
    const reviews = await storesService.getStoreReviews(storeId, { page, limit, order });
    return res.status(200).json(reviews);
  } catch (err) {
    return next(err);
  }
};

exports.getMyStores = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const ownerId = Number(req.user.id);

  if (!Number.isInteger(ownerId) || ownerId <= 0) {
    return next(new AppError("UNAUTHORIZED", 401, "authorization error"));
  }

  try {
    const {data, totalCount, totalPage} = await storesService.getMyStores(ownerId, page, limit);
    return res.status(200).json(new ApiResponse({stores: data}, {
      page,
      limit,
      totalCount,
      totalPage
    }));
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

exports.getStoreUnits = async (req, res, next) => {
  try {
    const { page, limit, order } = req.query;

    const {units, totalCount, totalPage} = await storesService.getStoreUnits(req.params.storeId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      order: order ? String(order) : "desc",
    });

    return res.status(200).json(new ApiResponse({units}, {page, limit, totalCount, totalPage}));
  } catch (err) {
    next(err);
  }
};

exports.createStoreUnit = async (req, res, next) => {
  try {
    const unit = await storesService.createStoreUnit(
      req.params.storeId,
      req.body,
      req.user
    );
    return res.status(201).json(unit);
  } catch (err) {
    next(err);
  }
};

exports.getStoreReservations = async (req, res, next) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    return next(new AppError("BAD_REQUEST", 400, "storeId is invalid"));
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const order = (req.query.order ?? "desc").toLowerCase(); // asc/desc

  try {
    const data = await storesService.getStoreReservations(storeId, { page, limit, order });
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};

exports.addFavorite = async (req, res, next) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    return next(new AppError("BAD_REQUEST", 400, "storeId is invalid"));
  }

  try {
    const favorite = await storesService.addFavorite(req.user.id, storeId);
    return res.status(200).json(favorite);
  } catch (err) {
    return next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId <= 0) {
    return next(new AppError("BAD_REQUEST", 400, "storeId is invalid"));
  }

  try {
    await storesService.removeFavorite(req.user.id, storeId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};