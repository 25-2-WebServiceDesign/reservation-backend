const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { authenticate } = require("../middleware/auth.middleware");

<<<<<<< HEAD
router.get("/me", authenticate, usersController.getMe);

module.exports = router;
=======
const authMiddleware = require("../middleware/auth.middleware");

// 사용자 등급
router.get('/me', authMiddleware.authenticate, userController.getMyDetail);

router.get("/:id", authMiddleware.authenticate, authMiddleware.authenticateRole(["ADMIN"]), userController.getDetailById);

// 사용자, 본인
// router.patch('/me', (req, res) => {});

// router.delete("/me", (req, res) => {});

// admin 등급 필요
// router.patch("/:id/role", authMiddleware.authenticate, authMiddleware.authenticateRole(["ADMIN"]), userController.changeRole)

// router.get('/me/reviews', (req, res) => {});

// router.get("/me/favorites", (req, res) => {});

module.exports = router;
>>>>>>> 0fd3ca4 (feat: add user)
