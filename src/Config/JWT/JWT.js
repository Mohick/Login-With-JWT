
const jwt = require('jsonwebtoken');
const env = require('../Object ENV/Object ENV');



const createJWT = (obToken) => {
    const tokenData = jwt.sign(obToken, env.EXPRESS_SECRET_TOKEN, {
        expiresIn: `${24 * Number(env.EXPRESS_DAY_TOKEN)}h`  // expires in 1 hour
    })
    return tokenData;
}
const verifyJWT = (stringToken, callback) => {
    return jwt.verify(stringToken, env.EXPRESS_SECRET_TOKEN, callback)
}
const setDateCookies = new Date(Date.now() + (24 * 60 * 60 * 1000 * Number(env.EXPRESS_DAY_TOKEN)))

module.exports = { createJWT, verifyJWT, setDateCookies };