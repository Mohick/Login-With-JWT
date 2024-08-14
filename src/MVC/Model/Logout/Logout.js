

class LogoutAccount {
    async logout(req, res) {
        res.clearCookie('authToken');
        res.json({
            valid: true,
            message: 'Logged out successfully'
        })
    }
}

module.exports = new LogoutAccount;
