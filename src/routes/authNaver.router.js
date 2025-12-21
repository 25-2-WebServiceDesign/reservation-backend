// 네이버 로그인 Node.js 예제는 1개의 파일로 로그인요청 및 콜백 처리를 모두합니다.
const express = require('express');
const router = express.Router();

const Controller = require("../controllers/authNaver.controller")


router.get('/login', Controller.naverLogin);

router.get('/callback', Controller.callback)

module.exports = router;
