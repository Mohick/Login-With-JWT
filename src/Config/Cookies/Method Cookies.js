const { setDateCookies } = require("../JWT/JWT");
const env = require("../Object ENV/Object ENV");



const methodsCookie = {
    expires: setDateCookies,
    secure: JSON.parse(env.EXPRESS_COOKIES_SECURE),
    httpOnly: JSON.parse(env.EXPRESS_COOKIES_ONLYHTTP), sameSite: "None"
}



module.exports = methodsCookie