const CreateAccount = require('../Model/CURD/Create');
const VerifiedAccount = require('../Model/Verify Account/Verify');
const Login = require('../Model/Login/Login');
const UpdateAccount = require("../Model/CURD/update")
const LogoutAccount = require("../Model/Logout/Logout")
const mainController = (app) => {

    app.post('/createUser', CreateAccount.CreateAccount)
    app.put("/verify-account", VerifiedAccount.verifiedAccount)
    app.post("/re-new-verify", VerifiedAccount.reNewVerify)
    app.post("/login", Login.login)
    app.put("/update-account", UpdateAccount.update)
    app.get("/automatic-login", Login.autoLoginEqualReadCookie)
    app.post("/logout", LogoutAccount.logout)
    app.post("/login-email", Login.loginWithGoogle)
}




module.exports = mainController;