const { setDateCookies } = require("../JWT/JWT");
const env = require("../Object ENV/Object ENV");



const methodsCookie = {
    expires: setDateCookies,
    secure: `${env.EXPRESS_COOKIES_SECURE}`.trim().toLowerCase() == "true".trim().toLowerCase(),
    httpOnly: `${env.EXPRESS_COOKIES_ONLYHTTP}`.trim().toLowerCase() == "true".trim().toLowerCase(),
    sameSite: "Lax"
}



module.exports = methodsCookie