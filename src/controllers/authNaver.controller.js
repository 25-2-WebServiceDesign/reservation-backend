require('dotenv').config();

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;

const redirectURI = encodeURI(process.env.NAVER_CALLBACK_URL);


const CustomError = require("../responses/customError")

module.exports = {
    getNaverLoginURL() {
        const state = (() => {
            const crypto = require("crypto");
            return crypto.randomBytes(16).toString('hex');
        })();
        // req.session.naverState = state;

        const apiUrl = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
        return apiUrl
    },

    async getProfile(code, state) {
        const apiUrl = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

        const options = {
            url: apiUrl,
            headers: {
                'X-Naver-Client-Id':client_id, 
                'X-Naver-Client-Secret': client_secret
            }
        };

        const axios = require("axios");

        try {
            const data = await axios.get(apiUrl, options);
            const profile = await axios.get(
                "https://openapi.naver.com/v1/nid/me", {
                headers: {
                    Authorization: `Bearer ${data.data.access_token}`
                }
            });

            return profile.data.response;
        } catch(err) {
            throw new CustomError("Internal Error", "axios getNaverUserAccess Error", 500);
        }
    },

    async login() {

    }
}



