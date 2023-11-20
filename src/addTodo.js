'use strict';

const { v4 } = require('uuid');
const aws = require('aws-sdk');

const addTodo = async (event) => {
  try {
    let todo = '';
    let completed = false;
    if (event.body) {
      const requestBody = JSON.parse(event.body);
      todo = requestBody.todo ?? '';
      if (requestBody.completed === true) {
        completed = true;
      }
    }
    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const newTodo = {
      id: v4(),
      todo,
      completed,
      createdAt: new Date()
    };
    await dynamoDB
      .put({
        TableName: process.env.TO_DO_TABLE,
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
