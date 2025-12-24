const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { authenticate, authenticateRole } = require("../middleware/auth.middleware");

router.get("/me", authenticate, usersController.getMe);

router.get("/:id", authenticate, authenticateRole(["ADMIN"]), usersController.getUserById);

// 사용자, 본인
// router.patch('/me', (req, res) => {});

// router.delete("/me", (req, res) => {});

// admin 등급 필요
// router.patch("/:id/role", authMiddleware.authenticate, authMiddleware.authenticateRole(["ADMIN"]), userController.changeRole)

// router.get('/me/reviews', (req, res) => {});

// router.get("/me/favorites", (req, res) => {});

module.exports = router;
