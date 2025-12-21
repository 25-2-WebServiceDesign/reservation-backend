const express = require("express");
const router = express.Router();

const storesController = require("../controllers/stores.controller");

router.post("/", storesController.createStore);
router.get("/", storesController.getStores);
router.get("/:storeId", storesController.getStoreById);
router.put("/:storeId", storesController.updateStore);
router.delete("/:storeId", storesController.deleteStore);

module.exports = router;
