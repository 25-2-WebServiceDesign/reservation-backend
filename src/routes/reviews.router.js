const express = require("express");
const router = express.Router();

const reviewsController = require("../controllers/reviews.controller");

router.get("/:id", reviewsController.getReviewById);

module.exports = router;
