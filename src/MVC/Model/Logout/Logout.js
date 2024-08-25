const methodsCookie = require("../../../Config/Cookies/Method Cookies");


class LogoutAccount {
    async logout(req, res) {
        res.clearCookie('authToken',methodsCookie);
        res.json({
            valid: true,
            message: 'Logged out successfully'
        })
    }
}

module.exports = new LogoutAccount;
