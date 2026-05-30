/* eslint-disable @typescript-eslint/no-require-imports */

const {
DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
DynamoDBDocumentClient,
PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
SESClient,
SendEmailCommand,
} = require("@aws-sdk/client-ses");

const { v4: uuidv4 } = require("uuid");

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

exports.handler = async (event) => {
try {
const body = JSON.parse(event.body);

const cycle = {
  cycleId: uuidv4(),

  name: body.name,

  startDate:
    body.startDate,

  endDate:
    body.endDate,

  employees:
    body.employees || [],

  status: "ACTIVE",

  createdAt:
    new Date().toISOString(),
};

// Save cycle
await docClient.send(
  new PutCommand({
    TableName:
      "ReviewCycles",

    Item: cycle,
  })
);

// Send SES Email
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
          "New Review Cycle Created",
      },

      Body: {
        Text: {
          Data: `

Review Cycle Created

Cycle Name: ${cycle.name}

Start Date: ${cycle.startDate}

End Date: ${cycle.endDate}

Employees In Scope:
${cycle.employees.join(", ")}

Status: ${cycle.status}
`,
},
},
},
})
);

return {
  statusCode: 200,

  headers: {
    "Access-Control-Allow-Origin":
      "*",
  },

  body: JSON.stringify({
    success: true,
    cycle,
  }),
};

} catch (error) {
console.error(error);

return {
  statusCode: 500,

  body: JSON.stringify({
    success: false,
    message:
      "Failed to create review cycle",
  }),
};

}
};