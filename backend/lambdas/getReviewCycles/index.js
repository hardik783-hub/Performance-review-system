/* eslint-disable @typescript-eslint/no-require-imports */

const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
});

const docClient =
  DynamoDBDocumentClient.from(client);

exports.handler = async () => {
  try {
    const result =
      await docClient.send(
        new ScanCommand({
          TableName:
            "ReviewCycles",
        })
      );

    return {
      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin":
          "*",
      },

      body: JSON.stringify(
        result.Items || []
      ),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,

      body: JSON.stringify({
        success: false,
      }),
    };
  }
};