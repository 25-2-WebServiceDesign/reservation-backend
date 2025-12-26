const admin = require("firebase-admin");
require("dotenv").config()
// firebase_config.json 없어서 기존 코드 주석처리
/* const serviceAccount = require("../../firebase_config.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin; */

let firebaseAdmin = null;

try {
    const serviceAccount = JSON.parse(
        Buffer.from(
            process.env.FIREBASE_CONFIG_BASE64,
            "base64"
        ).toString("utf-8")
    )

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    firebaseAdmin = admin;
    console.log("firebase initialized");
} catch (err) {
    console.warn("firebase_config.json not found. Firebase disabled.");
}

module.exports = firebaseAdmin;