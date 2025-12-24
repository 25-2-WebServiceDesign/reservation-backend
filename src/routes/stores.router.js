const express = require("express");
const router = express.Router();

const storesController = require("../controllers/stores.controller");
const { authenticate, authenticateRole } = require("../middleware/auth.middleware");

router.get("/me", authenticate, authenticateRole(["OWNER", "ADMIN"]), storesController.getMyStores);
router.post("/", authenticate, authenticateRole(["OWNER", "ADMIN"]), storesController.createStore);
router.get("/", storesController.getStores);
router.get("/:storeId", storesController.getStoreById);
//router.put("/:storeId", storesController.updateStore);
router.delete("/:storeId", authenticate, authenticateRole(["OWNER", "ADMIN"]),storesController.deleteStore);
router.patch("/:storeId", authenticate, authenticateRole(["OWNER", "ADMIN"]), storesController.patchStore);
router.get("/:storeId/units", storesController.getStoreUnits);
router.post("/:storeId/units", authenticate, authenticateRole(["OWNER", "ADMIN"]), storesController.createStoreUnit);

router.get("/:id/reservations", storesController.getStoreReservations);
router.get("/:id/reviews", storesController.getStoreReviews);

router.post("/:id/favorites", authenticate, storesController.addFavorite);
router.delete("/:id/favorites", authenticate, storesController.removeFavorite);

module.exports = router;
