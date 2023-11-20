const aws = require('aws-sdk');

const getTodoById = async (event) => {
  const dynamoDB = new aws.DynamoDB.DocumentClient();
  let id = event.pathParameters?.id ?? '';
  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.TO_DO_TABLE,
        Key: { id }
      })
      .promise();
    if (!result?.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No item found for the given ID!'
        })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Oops! Something went wrong!'
      })
    };
  }
};

module.exports.handler = getTodoById;
