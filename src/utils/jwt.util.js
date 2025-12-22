const JWT = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

const accessTokenExpiresIn = 60 * 60            // 1h
const refreshTokenExpiresIn = 60 * 60 * 24 * 7  // 7d

function generateAccessToken({id, role}) {
    return JWT.sign(
        {id, role}, 
        ACCESS_SECRET_KEY, 
        {
            algorithm: JWT_ALGORITHM,
            expiresIn: accessTokenExpiresIn,
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
    return JWT.sign({id}, REFRESH_SECRET_KEY, {
        algorithm: JWT_ALGORITHM, 
        expiresIn: refreshTokenExpiresIn
    });
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
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
};


// const token = generateRefreshToken(1);
// const decoded = verifyRefreshToken(token);

// console.log(new Date(decoded.exp * 1000).toISOString())