const express = require("express");
const router = express.Router();

const reviewsController = require("../controllers/reviews.controller");
const { authenticate }= require("../middleware/auth.middleware");

router.get("/my/list", authenticate, reviewsController.getMyReviews);
router.post("/", authenticate, reviewsController.createReview);
router.put("/:id", authenticate, reviewsController.updateMyReview);
router.delete("/:id", authenticate, reviewsController.deleteMyReview);

router.get("/:id", reviewsController.getReviewById);

module.exports = router;