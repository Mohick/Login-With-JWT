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
                    return res.json({ valid: false, message: "Email đã tồn tại." });
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
                                message: "Tài khoản đã được tạo thành công. Vui lòng xác minh địa chỉ email của bạn."
                            });
                        });
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tìm người dùng:", error);
                return res.json({ valid: false, message: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn." });
            }
        } else {
            return res.json(checked);
        }
    }
}

module.exports = new CreateAccount;
