

class LogoutAccount {
    async logout(req, res) {
        res.clearCookie('authToken');
    }
}

module.exports = new LogoutAccount;
