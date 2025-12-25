const express = require("express");
const router = express.Router();
const path = require("path")

const Controller = require("../controllers/authFirebase.controller");

router.get('/google', (req, res) => {
    res.sendFile(
        path.join(__dirname, "../../firebaseLogin.html"),
    )
})
// idToken 을 통해 로그인 시도
router.post('/login', Controller.googleLogin)

module.exports = router;