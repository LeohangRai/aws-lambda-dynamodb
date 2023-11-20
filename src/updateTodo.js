const aws = require('aws-sdk');

const updateTodo = async (event) => {
  const dynamoDb = new aws.DynamoDB.DocumentClient();
  let id = event.pathParameters?.id ?? '';
  try {
    const result = await dynamoDb
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
    let completed = result.Item.completed;
    let todo = result.Item.todo;
    if (event.body) {
      const requestBody = JSON.parse(event.body);
      if (requestBody.todo) {
        todo = requestBody.todo;
      }
      if (typeof requestBody.completed === 'boolean') {
        completed = requestBody.completed;
      }
    }
    const updatedTodo = await dynamoDb
      .update({
        TableName: process.env.TO_DO_TABLE,
        Key: { id },
        UpdateExpression: 'SET completed = :completed, todo = :todo',
        ExpressionAttributeValues: {
          ':completed': completed,
          ':todo': todo
        },
        ReturnValues: 'ALL_NEW' // return all of the attributes of the item as they appear after the update
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(updatedTodo)
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

module.exports.handler = updateTodo;
