const JWT = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

function generateAccessToken({id, role}) {
    return JWT.sign(
        {id, role}, 
        ACCESS_SECRET_KEY, 
        {
            algorithm: JWT_ALGORITHM,
            expiresIn: "1h"
        },
    )
}

function verifyAccessToken(token) {
    try {
        return JWT.verify(token, ACCESS_SECRET_KEY, {complete: false});
    } catch(err) {
        return null
    }
}

function generateRefreshToken(id) {
    return JWT.sign({id}, REFRESH_SECRET_KEY, {algorithm: JWT_ALGORITHM, expiresIn: "7d"});
}

function verifyRefreshToken(token) {
    try {
        return JWT.verify(token, REFRESH_SECRET_KEY, {complete: false});
    } catch(err) {
        return null
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};


// const token = generateRefreshToken(1);
// const decoded = verifyRefreshToken(token);

// console.log(new Date(decoded.exp * 1000).toISOString())