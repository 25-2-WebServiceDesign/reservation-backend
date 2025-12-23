const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");

router.post('/refresh', AuthController.refresh)
router.post('/logout', AuthController.logout)


module.exports = router;