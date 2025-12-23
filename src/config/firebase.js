const admin = require("firebase-admin");
// firebase_config.json 없어서 기존 코드 주석처리
/* const serviceAccount = require("../../firebase_config.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin; */

let firebaseAdmin = null;

try {
    const serviceAccount = require("../../firebase_config.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    firebaseAdmin = admin;
    console.log("firebase initialized");
} catch (err) {
    console.warn("firebase_config.json not found. Firebase disabled.");
}

module.exports = firebaseAdmin;