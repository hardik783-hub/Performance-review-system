/* eslint-disable @typescript-eslint/no-require-imports */

const crypto = require("crypto");

const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({
  region: "us-east-1",
});

const docClient =
  DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Generate SHA-256 hash for reviewer anonymity
    const reviewerHash = crypto
      .createHash("sha256")
      .update(body.reviewerId)
      .digest("hex");

    const review = {
      reviewId: uuidv4(),

      reviewType: "PEER",

      // Store hashed reviewer ID instead of raw ID
      reviewerHash,

      employeeId: body.employeeId,

      feedback: body.feedback,

      rating: Number(body.rating),

      anonymous: true,

      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: "Reviews",
        Item: review,
      })
    );

    return {
      statusCode: 200,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },

      body: JSON.stringify({
        success: true,

        review: {
          reviewId: review.reviewId,
          reviewType: review.reviewType,
          employeeId: review.employeeId,
          feedback: review.feedback,
          rating: review.rating,
          anonymous: review.anonymous,
          createdAt: review.createdAt,
        },
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },

      body: JSON.stringify({
        success: false,
        message: "Failed to submit peer review",
      }),
    };
  }
};