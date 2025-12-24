const express = require("express");
const router = express.Router();

const reviewsController = require("../controllers/reviews.controller");
const { authenticate }= require("../middleware/auth.middleware");

router.get("/:id", reviewsController.getReviewById);
router.put("/:id", authenticate, reviewsController.updateMyReview);
router.delete("/:id", authenticate, reviewsController.deleteMyReview);

module.exports = router;