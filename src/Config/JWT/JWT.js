
const jwt = require('jsonwebtoken');



const createJWT = (obToken) => {
    const tokenData = jwt.sign(obToken, process.env.EXPRESS__SECRET__TOKEN, {
        expiresIn: `${24 * Number(process.env.EXPRESS__DAY__TOKEN)}h`  // expires in 1 hour
    })
    return tokenData;
}
const verifyJWT = (stringToken, callback) => {
    return jwt.verify(stringToken, process.env.EXPRESS__SECRET__TOKEN, callback)
}
const setDateCookies = new Date(Date.now() + (24 * 60 * 60 * 1000 * Number(process.env.EXPRESS__DAY__TOKEN)))

module.exports = { createJWT, verifyJWT, setDateCookies };