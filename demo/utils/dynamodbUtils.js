
 "use strict";

 const DynamoDBLib = require("./dynamodb-lib").dynamoDb;
 
 class DynamoDB {
   /**
    * This function will return Dynamo DB Client.
    * @return {DocumentClient}
    * @constructor
    */
   static GetDynamoDBClient() {
     return new DynamoDBLib().getInstance().dynamoDb;
   }
 
   /**
    * This function will fetch data from Table by scan.
    * @param TableName
    * @return {*}
    * @constructor
    */
   static GetTableData(TableName) {
     if (TableName) {
       const params = {
         TableName
       };
       return DynamoDB.GetDynamoDBClient().scan(params).promise();
     }
     throw new Error("Invalid Input Params");
   }
 
   /**
    * This function will Update Table Data.
    * @param TableName
    * @param data
    * @param Key
    * @return {Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>}
    * @constructor
    */
   static UpdateTableData(TableName, data, Key) {
     if (
       TableName.trim() !== "" &&
       Object.keys(data).length > 0 &&
       Object.keys(Key).length > 0
     ) {
       let tmpUpdateExpression = [];
       const ExpressionAttributeValues = {};
       for (const key in data) {
         if (data.hasOwnProperty(key)) {
           ExpressionAttributeValues[`:${key}`] = data[key];
           tmpUpdateExpression.push(key + " = :" + key + " ");
         }
       }
       let UpdateExpression = " set " + tmpUpdateExpression.join(",");
       const params = {
         TableName,
         Key,
         UpdateExpression,
         ExpressionAttributeValues,
         ReturnValues: "UPDATED_NEW",
       };
       return DynamoDB.GetDynamoDBClient().update(params).promise();
     }
     console.log("Invalid Input Params");
   }
 
   /**
    * This function is used to Create an entry in Table.
    * @param TableName
    * @param Item
    * @return {Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>}
    * @constructor
    */
   static CreateTableData(TableName, Item) {
     if (TableName.trim() !== "" && Object.keys(Item).length > 0) {
       const params = {
         TableName,
         Item,
       };
       return DynamoDB.GetDynamoDBClient().put(params).promise();
     }
     console.log("Nothing to Create");
   }
 
   /**
    * This function is used to delete an entry from Table.
    * @param TableName
    * @param Key
    * @return {Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>>}
    * @constructor
    */
   static DeleteTableData(TableName, Key) {
     if (TableName.trim() !== "" && Object.keys(Key).length > 0) {
       const params = {
         TableName,
         Key,
       };
       return DynamoDB.GetDynamoDBClient().delete(params).promise();
     }
     console.log("Nothing to Delete");
   }

 }
 
 module.exports = DynamoDB;
 