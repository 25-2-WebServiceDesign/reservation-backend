const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/me", authenticate, usersController.getMe);

module.exports = router;
