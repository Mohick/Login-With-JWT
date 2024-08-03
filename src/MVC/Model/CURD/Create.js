const methodsCookie = require('../../../Config/Cookies/Method Cookies');
const { createJWT, setDateCookies } = require('../../../Config/JWT/JWT');
const env = require('../../../Config/Object ENV/Object ENV');
const ModelAccountSchema = require('../../../Schema/Create Account/Create Account');
const checkFormInputFromUser = require('../Check Form Input Create Account/Check Form Input');
const bcrypt = require('bcrypt');

class CreateAccount {
    async CreateAccount(req, res) {
        const { username, password, email } = req.body;
        // Validation checks
        const checked = {
            username: checkFormInputFromUser.username(username),
            password: checkFormInputFromUser.password(password),
            email: checkFormInputFromUser.email(email)
        };
        if (checked.username.valid && checked.password.valid && checked.email.valid) {
            try {
                const account = await ModelAccountSchema.find({ email });
                if (account.length > 0) {
                    return res.json({ valid: false, message: "Email already exists." });
                } else {
                    // Hash the password using bcrypt
                    // Create new account
                    return await bcrypt.genSalt(Number(env.EXPRESS_ROUNDS_HASH), (err, salt) => {
                        return bcrypt.hash(password, salt, function (err, hash) {
                            const newAccount = new ModelAccountSchema({
                                username: username,
                                password: hash,
                                email: email
                            });
                            const tokendata = createJWT({
                                _id: newAccount._id.toString(),
                                email: email,

                            })
                            res.cookie('authToken', tokendata, methodsCookie);  // expires in 1 hour
                            newAccount.save();
                            return res.json({
                                valid: true,
                                message: "Account created successfully. Please verify your email address."
                            });

                        });
                    });
                }
            } catch (error) {
                console.error("Error finding user:", error);
                return res.json({ valid: false, message: "An error occurred while processing your request." });
            }
        } else {
            return res.json(checked);
        }
    }
}

module.exports = new CreateAccount();
