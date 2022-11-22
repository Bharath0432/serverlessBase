
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1', endpoint: 'http://localhost:8000' });
class DynamoDbInstance {
    constructor() {
        this.dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    }
}
class DynamoDBFactory {
    constructor() {
        if (!DynamoDBFactory.instance) {
            DynamoDBFactory.instance = new DynamoDbInstance();
        }
    }

    getInstance() {
        return DynamoDBFactory.instance;
    }
}
module.exports.dynamoDb = DynamoDBFactory;
