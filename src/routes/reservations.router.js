const express = require("express");
const router = express.Router();

const reservationsController = require("../controllers/reservations.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, reservationsController.getMyReservations);

module.exports = router;