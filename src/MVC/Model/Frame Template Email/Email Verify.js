const env = require("../../../Config/Object ENV/Object ENV");




const temPlateVerifyEmail = (username, email, verificationCode) => {
    const templateParams = {
        from_name: env.EXPRESS_NAME_EMAIL_KEY_EMAIL,
        to: email,
        to_name: username,
        message: verificationCode,
        reply_to: env.EXPRESS_REPLY_EMAIL_KEY_EMAIL
    };
    return templateParams;
}

module.exports = temPlateVerifyEmail;