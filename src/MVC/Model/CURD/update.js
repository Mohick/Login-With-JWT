const bcrypt = require('bcrypt');
const checkFormInputFromUser = require("../Check Form Input Create Account/Check Form Input");
const ModelAccountSchema = require("../../../Schema/Create Account/Create Account");
const VerifiedAccounts = require('../Verify Account/Verify');
const { verifyJWT, createJWT } = require('../../../Config/JWT/JWT');
const env = require('../../../Config/Object ENV/Object ENV');
const methodsCookie = require('../../../Config/Cookies/Method Cookies');

class UpdateAccount {

    async update(req, res, next) {
        const { authToken } = req.cookies

        if (authToken) {

            return verifyJWT(authToken, async function (err, authToken) {
                try {
                    if (authToken) {
                        const { _id, email, exp } = authToken;
                        const { newUsername, newEmail, newPassword, currentPassword } = req.body;

                        if (!currentPassword) return res.json({
                            valid: false,
                            message: "Mật khẩu hiện tại không đúng."
                        })
                        // Validation checks
                        if (!newUsername && !newEmail) return res.status(400).json({
                            valid: false,
                            message: "Thiếu thông tin cần thiết"
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
                                                    message: "Email đã tồn tại."
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
                                                    res.cookie('authToken', tokenData, methodsCookie);  // expires in 1 hour
                                                    VerifiedAccounts.createVerifyAccount(newUsername, newEmail)
                                                } else {
                                                    await bcrypt.genSalt(Number(env.EXPRESS_ROUNDS_HASH), function (err, salt) {
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
                                                            res.cookie('authToken', tokenData, methodsCookie);  // expires in 1 hour
                                                            VerifiedAccounts.createVerifyAccount(newUsername, newEmail)

                                                        });
                                                    });

                                                }

                                                return res.json({
                                                    valid: true,
                                                    message: "Cập nhật tài khoản thành công."
                                                });
                                            }
                                        } else {
                                            return res.json({
                                                valid: false,
                                                message: "Mật khẩu hiện tại không đúng."
                                            });
                                        }
                                    } else {
                                        return res.json({
                                            valid: false,
                                            message: "Email không tồn tại."
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
                                                await bcrypt.genSalt(Number(env.EXPRESS_ROUNDS_HASH), function (err, salt) {
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
                                                message: "Cập nhật tài khoản thành công."
                                            });
                                        } else {
                                            return res.json({
                                                valid: false,
                                                message: "Mật khẩu hiện tại không đúng."
                                            });
                                        }
                                    } else {
                                        return res.json({
                                            valid: false,
                                            message: "Không tìm thấy tài khoản."
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
                            message: "Không được phép"
                        });
                    }
                } catch (error) {
                    console.log(error);
                    console.log(err);

                    return res.status(500).json({
                        valid: false,
                        message: "Đã xảy ra lỗi khi cập nhật tài khoản"
                    });

                }
            })

        } else {
            return res.status(400).json({
                valid: false,
                message: "Không tìm thấy tài khoản trong phiên"
            });
        }
    }
}


module.exports = new UpdateAccount
