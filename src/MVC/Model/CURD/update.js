
const bcrypt = require('bcrypt');
const checkFormInputFromUser = require("../Check Form Input Create Account/Check Form Input");
const ModelAccountSchema = require("../../../Schema/Create Account/Create Account");
const VerifiedAccounts = require('../Verify Account/Verify');
const { verifyJWT, createJWT, setDateCookies } = require('../../../Config/JWT/JWT');

class UpdateAccount {

    async update(req, res, next) {
        const { authToken } = req.cookies

        if (authToken) {

            return verifyJWT(authToken, async function (err, authToken) {
                if (authToken) {
                    const { _id, email } = authToken;
                    const { newUsername, newEmail, newPassword, currentPassword } = req.body;


                    if (!currentPassword) return res.json({
                        valid: false,
                        message: "Current password is incorrect."
                    })
                    // Validation checks
                    if (!newUsername && !newEmail) return res.status(400).json({
                        valid: false,
                        message: "Missing required fields"
                    })
                    const checked = {
                        username: checkFormInputFromUser.username(newUsername),
                        password: newPassword.trim().length < 1 ? checkFormInputFromUser.password(currentPassword) : checkFormInputFromUser.password(newPassword),
                        email: checkFormInputFromUser.email(newEmail)
                    };
                    if (checked.username.valid && checked.password.valid && checked.email.valid) {
                        try {
                            if (newEmail !== email) {
                                const [oldInfoAccount, checkNewAccount] = await Promise.all([
                                    ModelAccountSchema.findOne({ _id, email }),
                                    ModelAccountSchema.find({ email: newEmail })
                                ])
                                if (oldInfoAccount.email && oldInfoAccount._id) {
                                    const match = await bcrypt.compare(currentPassword, oldInfoAccount.password)

                                    if (match) {
                                        if (checkNewAccount.length > 0) {
                                            return res.json({
                                                valid: false,
                                                message: "Email already exists."
                                            });
                                        } else {
                                            if (!checkFormInputFromUser.password(newPassword).valid) {
                                                let newAccount = {
                                                    username: newUsername,
                                                    verified: false,
                                                    email: newEmail,
                                                }
                                                await ModelAccountSchema.findByIdAndUpdate(_id, newAccount, { new: true });
                                                const tokenData = createJWT({
                                                    email: newEmail,
                                                    _id: oldInfoAccount._id
                                                })
                                                res.cookie('authToken', tokenData, { expires: setDateCookies });  // expires in 1 hour
                                                VerifiedAccounts.createVerifyAccount(newUsername, newEmail)
                                            } else {
                                                await bcrypt.genSalt(Number(process.env.EXPRESS__ROUNDS__HASH), function (err, salt) {
                                                    bcrypt.hash(newPassword, salt, async function (err, hash) {
                                                        let newAccount = {
                                                            username: newUsername,
                                                            email: newEmail,
                                                            verified: false,
                                                            password: hash
                                                        }
                                                        await ModelAccountSchema.findByIdAndUpdate(_id, newAccount, { new: true });
                                                        const tokenData = createJWT({
                                                            email: newEmail,
                                                            _id: oldInfoAccount._id
                                                        })
                                                        res.cookie('authToken', tokenData, { expires: setDateCookies });  // expires in 1 hour
                                                        VerifiedAccounts.createVerifyAccount(newUsername, newEmail)

                                                    });
                                                });

                                            }

                                            return res.json({
                                                valid: true,
                                                message: "Account updated successfully."
                                            });
                                        }
                                    } else {
                                        return res.json({
                                            valid: false,
                                            message: "Current password is incorrect."
                                        });
                                    }
                                } else {
                                    return res.json({
                                        valid: false,
                                        message: "Email does not exist."
                                    });
                                }
                            } else {
                                const account = await ModelAccountSchema.findOne({ _id, email })
                                if (account._id && account.email) {
                                    const match = await bcrypt.compare(currentPassword, account.password)
                                    if (match) {

                                        if (!checkFormInputFromUser.password(newPassword).valid) {
                                            const newAccount = {
                                                username: newUsername,
                                            }

                                            await ModelAccountSchema.findByIdAndUpdate(_id, newAccount, { new: true });
                                        } else {
                                            await bcrypt.genSalt(Number(process.env.EXPRESS__ROUNDS__HASH), function (err, salt) {
                                                return bcrypt.hash(newPassword, salt, async function (err, hash) {

                                                    const newAccount = {
                                                        username: newUsername,
                                                        password: hash
                                                    }

                                                    await ModelAccountSchema.findByIdAndUpdate(_id, newAccount, { new: true });
                                                });
                                            });
                                        }
                                        return res.json({
                                            valid: true,
                                            message: "Account updated successfully."
                                        });
                                    } else {
                                        return res.json({
                                            valid: false,
                                            message: "Current password is incorrect."
                                        });
                                    }
                                } else {
                                    return res.json({
                                        valid: false,
                                        message: "Account not found."
                                    });
                                }
                            }
                        } catch (error) {
                            next(error);
                        }
                    } else {
                        return res.status(400).json(checked);
                    }
                } else {
                    return res.status(401).json({
                        valid: false,
                        message: "Unauthorized"
                    });
                }
            })

        } else {
            return res.status(400).json({
                valid: false,
                message: "No account found in session"
            });
        }
    }
}


module.exports = new UpdateAccount