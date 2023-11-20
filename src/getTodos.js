const aws = require('aws-sdk');

const getTodos = async (_event) => {
  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.TO_DO_TABLE
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Oops! Something went wrong!'
      })
    };
  }
};

module.exports.handler = getTodos;
