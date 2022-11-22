'use strict';
const UserResponse = require("../utils/response");
const { success, failure } = UserResponse;
const DynamoDBUtils = require('../utils/dynamodbUtils');
const { payloadValidator } = require("../utils/payload-validator");
const { validate } = require("../utils/tokenValidater");
const createUserSchema = require("../schemas/createUser.json");
const editUserSchema = require("../schemas/editUser.json");
const bcrypt = require("bcryptjs");
const TableName = "users"
module.exports.createUser = async (event) => {
  const body = JSON.parse(event.body);
  const headers = event.headers
  const validateToken = await validate(headers.authorization)
  if (!validateToken) {
    return failure({ message: "unauthorised" });
  }
  const err = payloadValidator(createUserSchema, body);
  if (err) {
    return failure({ message: err });
  }

  try {
    const password = body.email.split('@')[0] + "@1";
    body.password = bcrypt.hashSync(password, 8);
    body.status = "Active";
    const data = await DynamoDBUtils.CreateTableData(TableName, body);
    return success({ data });
  }
  catch (err) {
    console.log("user create failed failed :::", err);
    return failure(err);
  }
};

module.exports.editUser = async (event) => {
  const body = JSON.parse(event.body);
  const headers = event.headers
  console.log("event-------------", headers)
  const validateToken = await validate(headers.authorization)
  if (!validateToken) {
    return failure({ message: "unauthorised" });
  }
  const err = payloadValidator(editUserSchema, body);
  if (err) {
    return failure({ message: err });
  }

  try {
    const data = JSON.parse(event.body)
    const key = {
      "email": data.email
    }
    delete data.email;
    delete data.password;
    const res = await DynamoDBUtils.UpdateTableData(TableName, data, key)
    return success({ res });
  }
  catch (err) {
    console.log("user update failed failed :::", err);
    return failure(err);
  }
};

module.exports.deleteUser = async (event) => {
  const body = JSON.parse(event.body);
  const headers = event.headers;
  
  console.log("event-------------", headers)
  const validateToken = await validate(headers.authorization)
  if (!validateToken) {
    return failure({ message: "unauthorised" });
  }
  const err = payloadValidator(editUserSchema, body);
  if (err) {
    return failure({ message: err });
  }

  try {
    const data = JSON.parse(event.body)
    const key = {
      "email": data.email
    }
    const res = await DynamoDBUtils.DeleteTableData(TableName,key)
    return success({ res });
  }
  catch (err) {
    console.log("user update failed failed :::", err);
    return failure(err);
  }
};

module.exports.getUsers = async (event) => {
  const headers = event.headers;
  const validateToken = await validate(headers.authorization)
  if (!validateToken) {
    return failure({ message: "unauthorised" });
  }
  try {
    const res = await DynamoDBUtils.GetTableData(TableName)
    return success({ res });
  }
  catch (err) {
    console.log("users get failed failed :::", err);
    return failure(err);
  }
};