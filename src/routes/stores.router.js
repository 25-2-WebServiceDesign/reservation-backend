const express = require("express");
const router = express.Router();

const storesController = require("../controllers/stores.controller");
const { authenticate, authenticateRole } = require("../middleware/auth.middleware");

router.post("/", authenticate, authenticateRole(["OWNER", "ADMIN"]), storesController.createStore);

router.get("/", storesController.getStores);
router.get("/:storeId", storesController.getStoreById);
router.put("/:storeId", storesController.updateStore);
router.delete("/:storeId", storesController.deleteStore);

router.get("/:id/reviews", storesController.getStoreReviews);
module.exports = router;
