'use strict';

const { v4 } = require('uuid');
const aws = require('aws-sdk');

const addTodo = async (event) => {
  try {
    const { todo } = event.body;
    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const newTodo = {
      id: v4(),
      todo,
      createdAt: new Date(),
      completed: false
    };
    await dynamoDB
      .put({
        TableName: 'ToDoTable',
        Item: newTodo
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(newTodo)
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

module.exports.handler = addTodo;
