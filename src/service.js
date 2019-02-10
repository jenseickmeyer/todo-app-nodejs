'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid/v4');

const TasksTableName = process.env.TABLE_NAME;

exports.createTask = async (task) => {
  // Generate a unique ID for the new task
  task.id = uuid();
  // All new tasks are not done when they are created
  task.done = false;

  const params = {
    TableName: TasksTableName,
    Item: task
  };

  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.log(`Failed to create task: ${error}`);
    throw error;
  }
};

exports.getTask = async (id) => {
  const params = {
    TableName: TasksTableName,
    Key: {
      id: id
    }
  };

  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item === undefined ? null : result.Item;
  } catch (error) {
    console.log(`Failed to get task with id "${id}": ${error}`);
    throw error;
  }
};

exports.listTasks = async () => {
  const params = {
    TableName: TasksTableName
  };

  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    const results = await dynamoDB.scan(params).promise();
    return results.Items;
  } catch (error) {
    console.log(`Failed to fetch tasks: ${error}`);
    throw error;
  }
};

exports.updateTask = async (id, task) => {
  task.id = id;
  const params = {
    TableName: TasksTableName,
    Item: task
  };

  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.log(`Failed to update task: ${error}`);
    throw error;
  }
};

exports.deleteTask = async (id) => {
  const params = {
    TableName: TasksTableName,
    Key: {
      id: id
    }
  };

  const dynamoDB = new aws.DynamoDB.DocumentClient();
  try {
    await dynamoDB.delete(params).promise();
  } catch (error) {
    console.log(`Failed to delete task with id "${id}": ${error}`);
    throw error;
  }
};
