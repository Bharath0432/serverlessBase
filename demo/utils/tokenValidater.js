var jwt = require("jsonwebtoken");
const secret = process.env.secret;

module.exports.validate = async (token) => {
    try {
        var decoded = await jwt.verify(token, secret);
        if (decoded.userRole && decoded.userRole === "Superadmin") {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("errr", err)
        return false;
    }
}