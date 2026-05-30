/* eslint-disable @typescript-eslint/no-require-imports */

const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const dynamoClient =
  new DynamoDBClient({
    region: "us-east-1",
  });

const docClient =
  DynamoDBDocumentClient.from(
    dynamoClient
  );

const s3Client =
  new S3Client({
    region: "us-east-1",
  });

const BUCKET_NAME =
  "performane-review-reports";

exports.handler = async (event) => {
  try {
    const employeeId =
      event.pathParameters.employeeId;

    const result =
      await docClient.send(
        new ScanCommand({
          TableName: "Reviews",
        })
      );

    const reviews =
      (result.Items || []).filter(
        (review) =>
          review.employeeId === employeeId
      );

    const selfReview =
      reviews.find(
        (review) =>
          review.reviewType === "SELF"
      );

    const peerReviews =
      reviews.filter(
        (review) =>
          review.reviewType === "PEER"
      );

    const managerReview =
      reviews.find(
        (review) =>
          review.reviewType === "MANAGER"
      );

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Performance Report</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: #f4f4f4;
    }

    .card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      max-width: 700px;
      margin: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
    }

    p {
      font-size: 16px;
    }
  </style>
</head>

<body>
  <div class="card">
    <h1>Performance Report</h1>

    <h2>Employee ID: ${employeeId}</h2>

    <p>
      <strong>Self Rating:</strong>
      ${selfReview?.rating || 0}
    </p>

    <p>
      <strong>Manager Rating:</strong>
      ${managerReview?.rating || 0}
    </p>

    <p>
      <strong>Peer Reviews:</strong>
      ${peerReviews.length}
    </p>

    <p>
      <strong>Generated At:</strong>
      ${new Date().toISOString()}
    </p>
  </div>
</body>
</html>
`;

    const key =
      `reports/${employeeId}.html`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket:
          BUCKET_NAME,

        Key: key,

        Body: html,

        ContentType:
          "text/html",
      })
    );

    const reportUrl =
      `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin":
          "*",

        "Access-Control-Allow-Headers":
          "*",
      },

      body: JSON.stringify({
        success: true,
        employeeId,
        reportUrl,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,

      headers: {
        "Access-Control-Allow-Origin":
          "*",

        "Access-Control-Allow-Headers":
          "*",
      },

      body: JSON.stringify({
        success: false,
        message:
          "Failed to generate report",
      }),
    };
  }
};