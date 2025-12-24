const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { authenticate, authenticateRole } = require("../middleware/auth.middleware");

router.get("/me", authenticate, usersController.getMe);
router.patch("/me", authenticate, usersController.updateMe);

router.get("/:id", authenticate, authenticateRole(["ADMIN"]), usersController.getUserById);

// 사용자, 본인
router.patch('/me', authenticate, usersController.updateMe);

// 관리자는 제거 불가
router.delete("/me", authenticate, usersController.deleteMe);

// admin 등급 필요
router.patch("/:id/role", authenticate, authenticateRole(["ADMIN"]), usersController.changeRole)

// router.get('/me/reviews', (req, res) => {});

// router.get("/me/favorites", (req, res) => {});

module.exports = router;
