/* eslint-disable @typescript-eslint/no-require-imports */

const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  SESClient,
  SendEmailCommand,
} = require("@aws-sdk/client-ses");

const dynamoClient =
  new DynamoDBClient({
    region: "us-east-1",
  });

const docClient =
  DynamoDBDocumentClient.from(
    dynamoClient
  );

const sesClient =
  new SESClient({
    region: "us-east-1",
  });

exports.handler = async () => {
  try {
    const result =
      await docClient.send(
        new ScanCommand({
          TableName:
            "ReviewCycles",
        })
      );

    const cycles =
      result.Items || [];

    const today =
      new Date();

    for (const cycle of cycles) {
      const endDate =
        new Date(
          cycle.endDate
        );

      const diffDays =
        Math.ceil(
          (
            endDate -
            today
          ) /
            (
              1000 *
              60 *
              60 *
              24
            )
        );

      if (
        diffDays === 3 ||
        diffDays === 1
      ) {
        await sesClient.send(
          new SendEmailCommand({
            Source:
              "hardikgargg000@gmail.com",

            Destination: {
              ToAddresses: [
                "garghardikg000@gmail.com",
              ],
            },

            Message: {
              Subject: {
                Data:
                  "Review Cycle Reminder",
              },

              Body: {
                Text: {
                  Data: `
Reminder:

Review cycle "${cycle.name}"
ends in ${diffDays} day(s).

End Date:
${cycle.endDate}
                  `,
                },
              },
            },
          })
        );
      }
    }

    return {
      statusCode: 200,

      body: JSON.stringify({
        success: true,
      }),
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