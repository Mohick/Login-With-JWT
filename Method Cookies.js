const { setDateCookies } = require("../JWT/JWT");
const env = require("../Object ENV/Object ENV");



const methodsCookie = {
    expires: setDateCookies,
    secure: `${env.EXPRESS_COOKIES_SECURE}`.trim().toLowerCase() == "true".trim().toLowerCase(),
    httpOnly: `${env.EXPRESS_COOKIES_ONLYHTTP}`.trim().toLowerCase() == "true".trim().toLowerCase(),
    sameSite: env.EXPRESS__COOKIES__SAMESITE
}



module.exports = methodsCookie