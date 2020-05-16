'use strict';

const service = require('./service.js');

exports.listTasks = async () => {
  const tasks = await service.listTasks();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tasks, null, 2)
  };
};

exports.createTask = async (event) => {
  const hostname = event.headers.Host;
  const path = event.requestContext.path;

  let task = JSON.parse(event.body);

  await service.createTask(task);
  return {
    statusCode: 201,
    headers: {
      'Location': `https://${hostname}${path}/${task.id}`
    }
  };
};

exports.getTask = async (event) => {
  const id = event.pathParameters.id;

  const task = await service.getTask(id);
  if (task === null) {
    return {
      statusCode: 404
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(task, null, 2)
  };
};

exports.updateTask = async (event) => {
  const id = event.pathParameters.id;

  if (await service.getTask(id) === null) {
    return {
      statusCode: 404
    };
  }

  let task = JSON.parse(event.body);

  await service.updateTask(id, task);

  return {
    statusCode: 200
  };
};

exports.deleteTask = async (event) => {
  const id = event.pathParameters.id;

  if (await service.getTask(id) === null) {
    return {
      statusCode: 404
    };
  }

  await service.deleteTask(id);

  return {
    statusCode: 200
  };
};
