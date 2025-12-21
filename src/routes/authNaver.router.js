// 네이버 로그인 Node.js 예제는 1개의 파일로 로그인요청 및 콜백 처리를 모두합니다.
const express = require('express');
const router = express.Router();
// require('dotenv').config();

// const client_id = process.env.NAVER_CLIENT_ID;
// const client_secret = process.env.NAVER_CLIENT_SECRET;

// const redirectURI = encodeURI(process.env.NAVER_CALLBACK_URL);

const Controller = require("../controllers/authNaver.controller")


router.get('/auth/naver/login', (req, res) => {
    const apiUrl = Controller.getNaverLoginURL();
    // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    // res.redirectURI(api_url)
    // res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
    res.redirect(apiUrl);
});

router.get('/callback', async (req, res) => {

    const code = req.query.code;
    const state = req.query.state;

    // state 검증
    // if (state !== req.session.naverState) {
    //     return res.status(403).json({
    //         message: "Invalid state"
    //     })
    // }

    try {
        const profile = await Controller.getProfile(code, state);
        res.status(200).json(profile)
    } catch(err) {
        res.status(err.statusCode || 500).json(err.response() || "Internal Error")
    }
})

module.exports = router;
