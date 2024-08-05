const methodsCookie = require('../../../Config/Cookies/Method Cookies');
const { verifyJWT, setDateCookies, createJWT } = require('../../../Config/JWT/JWT');
const ModelAccountSchema = require('../../../Schema/Create Account/Create Account');
const checkFormInputFromUser = require('../Check Form Input Create Account/Check Form Input');
const VerifiedAccounts = require('../Verify Account/Verify')
const bcrypt = require('bcrypt');

class LoginAccount {
    async login(req, res) {
        const { email, password } = req.body;

        // Validation checks
        const checked = {
            email: checkFormInputFromUser.email(email),
            password: checkFormInputFromUser.password(password)
        };

        if (checked.email.valid && checked.password.valid) {
            try {
                const account = await ModelAccountSchema.findOne({ email: email });

                switch (true) {
                    case !account:
                    case !(await bcrypt.compare(password, account.password)):
                        // Nếu mật khẩu không khớp
                        return res.status(200).json({ valid: false, message: "Mật khẩu không hợp lệ" });
                    default:
                        // Nếu mọi thứ đều đúng
                        const tokenData = createJWT({
                            _id: account._id,
                            email: account.email,
                        })
                        res.cookie('authToken', tokenData, methodsCookie);
                        return res.json({ valid: true, message: "Đăng nhập thành công" });
                }

            } catch (error) {
                console.error("Lỗi tìm tài khoản:", error);
                return res.status(500).json({ valid: false, message: "Lỗi máy chủ nội bộ" });
            }
        } else {
            return res.status(400).json({ valid: false, message: "Định dạng email hoặc mật khẩu không hợp lệ" });
        }
    }
    async autoLoginEqualReadCookie(req, res) {

        const { authToken } = req.cookies

        if (authToken) {
            return verifyJWT(authToken, async function (err, authToken) {
                try {
                    if (authToken) {
                        const { _id, email, exp } = authToken
                        try {
                            switch (true) {

                                case !_id || !email:
                                    return res.json({
                                        login: false,
                                        message: "Thiếu email hoặc ID"
                                    });
                                default:
                                    // Find account by email and ID
                                    const account = await ModelAccountSchema.findOne({ email, _id });

                                    switch (true) {
                                        case !account:
                                            // Trường hợp không tìm thấy tài khoản
                                            return res.json({
                                                valid: false,
                                                message: "Không tìm thấy tài khoản"
                                            });

                                        case account.email !== email:
                                            // Trường hợp email không khớp
                                            return res.json({
                                                valid: false,
                                                message: "Email không khớp"
                                            });

                                        default:
                                            // Trường hợp tài khoản và email hợp lệ
                                            if (account.verified) {

                                                return res.json({
                                                    username: account.username,
                                                    email: account.email,
                                                    password: "*************",
                                                    login: true,
                                                    verified: account.verified,
                                                    message: "Đăng nhập tự động thành công"
                                                });
                                            } else {
                                                await VerifiedAccounts.createVerifyAccount(account.username, account.email)
                                                return res.json({
                                                    username: account.username,
                                                    email: account.email,
                                                    password: "*************",
                                                    login: true,
                                                    verified: account.verified,
                                                    message: "Đăng nhập tự động thành công"
                                                });
                                            }
                                    }
                            }
                        } catch (error) {
                            console.error("Lỗi tìm tài khoản:", error);
                            return res.status(500).json({ valid: false, message: "Lỗi máy chủ nội bộ" });
                        }

                    } else {
                        return res.json({
                            login: false,
                            message: "Không tìm thấy token xác thực"
                        });
                    }
                } catch (error) {
                    console.log(err);
                }
            })
        } else {
            return res.json({
                login: false,
                message: "Không tìm thấy tài khoản trong phiên"
            });
        }
    }
}

module.exports = new LoginAccount;
