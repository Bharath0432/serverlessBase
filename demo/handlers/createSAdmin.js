'use strict';
const UserResponse = require("../utils/response");
const { success, failure } = UserResponse;
const DynamoDBUtils = require('../utils/dynamodbUtils');

module.exports.createSU = async (event) => {
  console.log('-----------------',event)
  try {
  const User =  {
      firstName: 'bharath',
      lastName: 'thathuru',
      email: 'bharath.fullstack@gmail.com',
      city:'Bangalore',
      country:'India',
      password:'$2a$08$SCdiR9tOAu1xBmOlFiQDxOFETGxufVF9au9GhN/bjGzBzCBRq3cn6',
      userRole:'Superadmin',
      status:'Active',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
  }
    console.log('!!!!!!!!!!!!!!!!!!!!!',new Date());
    const data = await DynamoDBUtils.CreateTableData("users", User);
    const User1 =  {
      tableName:'usersTable',
      partitionKey:{
        name: 'email',
        value: 'bharath.fullstack@gmail.com'
      },
      filters:['email']
  }
    // const data1 = await DynamoDBUtils.QueryTableData(User1);
    const data1 = await DynamoDBUtils.GetTableData("users",{'email':"bharath.fullstack@gmail.com"});
    
    console.log('++++++++++++++++++++++',data)
    console.log('####################',data1)
    return success({ data });
  }
  catch (err) {
    console.log("dynamodb update failed :::", err);
    return failure(err);
  }
};
