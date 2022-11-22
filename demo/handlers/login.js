var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const UserResponse = require("../utils/response");
const { success, failure } = UserResponse;
const { payloadValidator } = require("../utils/payload-validator");
const schema = require("../schemas/login.json");
const DynamoDBUtils = require('../utils/dynamodbUtils');
const secret = process.env.secret;

module.exports.login = async event => {
    const body = JSON.parse(event.body)
    const err = payloadValidator(schema, body);
    if (err) {
        return failure({ message: err });
    }

    console.log(bcrypt.hashSync(body.password, 8));
    const usersData = await DynamoDBUtils.GetTableData("usersTable", { 'email': body.email });
    console.log('user-----', usersData.Items[0])
    if (!usersData.Items.length > 1) {
        return failure({ message: "User Not found." });
    }
    const user = usersData.Items[0]
    if (user.status == "Active") {
        var passwordIsValid = bcrypt.compareSync(
            body.password,
            user.password
        );

        if (!passwordIsValid) {
            return  failure({ message: "Invalid Password!" });
        }

        var token = jwt.sign({ email: user.email,userRole:user.userRole }, secret, {
            expiresIn: 86400 // 24 hours
            // expiresIn: 300
        });
        return success({
            data: {
                id: user.id,
                username: user.firstName + ' ' + user.lastName,
                email: user.email,
                userRole: user.userRole,
                accessToken: token
            }
        });
    }
    else {
        return failure({ message: "Please contact Super Admin to activate your account!" });
    }


}