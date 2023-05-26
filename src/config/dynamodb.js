const AWS = require('aws-sdk');
const config = require('./index');

AWS.config.update({ region: config.db.region });

const dynamodb = new AWS.DynamoDB({ endpoint: config.db.endpoint });

module.exports = {
  dynamodb
};