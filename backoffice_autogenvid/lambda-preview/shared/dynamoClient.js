'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const region = process.env.AWS_REGION || 'us-east-1';

const raw = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(raw, {
  marshallOptions:   { removeUndefinedValues: true },
  unmarshallOptions: { wrapNumbers: false },
});

module.exports = { docClient };
