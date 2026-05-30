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

    const managerReview =
      reviews.find(
        (review) =>
          review.reviewType === "MANAGER"
      );

    const peerReviews =
      reviews.filter(
        (review) =>
          review.reviewType === "PEER"
      );

    const selfReviewSubmitted =
      !!selfReview;

    const managerReviewSubmitted =
      !!managerReview;

    const peerReviewsSubmitted =
      peerReviews.length;

    const cycleComplete =
      selfReviewSubmitted &&
      managerReviewSubmitted &&
      peerReviewsSubmitted > 0;

    return {
      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin":
          "*",

        "Access-Control-Allow-Headers":
          "*",
      },

      body: JSON.stringify({
        employeeId,

        selfReviewSubmitted,

        managerReviewSubmitted,

        peerReviewsSubmitted,

        cycleComplete,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,

      body: JSON.stringify({
        success: false,
        message:
          "Failed to get review status",
      }),
    };
  }
};