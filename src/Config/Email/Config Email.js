
const emailjs = require("@emailjs/nodejs");
const env = require("../Object ENV/Object ENV");


const SendEmail = (templateParams) => {
    emailjs
        .send(env.EXPRESS_SERVICE_EMAIL, env.EXPRESS_TEMPLATE_EMAIL, templateParams, {
            publicKey: env.EXPRESS_PUBLIC_KEY_EMAIL,
            privateKey: env.EXPRESS_PRIVATE_KEY_EMAIL,
        })
        .then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
            },
            (err) => {
                console.log('FAILED...', err);
            },
        );
}

module.exports = SendEmail;