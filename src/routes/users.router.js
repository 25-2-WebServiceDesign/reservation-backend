const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { anthenticate } = require("../middleware/auth.middleware");

router.get("/me", authenticate, usersController.getMe);

module.exports = router; 
