const express = require("express");
const router = express.Router();

const reservationsController = require("../controllers/reservations.controller");
const { authenticate } = require("../middleware/auth.middleware");
const reviewsController = require("../controllers/reviews.controller");

router.get("/", authenticate, reservationsController.getMyReservations);
router.get("/:id", authenticate, reservationsController.getReservationById);
router.patch("/:id/status", authenticate, reservationsController.updateReservationStatus);
router.put("/:id", authenticate, reservationsController.updateReservation);
router.post("/:id/review", authenticate, reviewsController.createReviewForReservation);

module.exports = router;