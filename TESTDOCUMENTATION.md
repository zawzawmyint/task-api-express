# API Testing Documentation

## Overview

This document outlines the test cases for the Task API Express application.

## Test Cases

## Authentication

### 1. POST /api/users/login

- **Description**: Authenticate user and obtain JWT token
- **Expected Response**: 200 OK with JWT token
- **Test Steps**:
  1. Send POST request with valid credentials
  2. Verify response status code
  3. Verify response contains JWT token

### 1. GET /api/tasks

- **Description**: Retrieve all tasks
- **Expected Response**: 200 OK with array of tasks
- **Test Steps**:
  1. Send GET request to `/tasks`
  2. Verify response status code
  3. Verify response contains array of tasks

### 2. POST /api/tasks

- **Description**: Create new task
- **Expected Response**: 201 Created with new task details
- **Test Steps**:
  1. Send POST request with task data
  2. Verify response status code
  3. Verify task was created with correct data

### 3. PUT /api/tasks/:id

- **Description**: Update existing task
- **Expected Response**: 200 OK with updated task
- **Test Steps**:
  1. Send PUT request with updated data
  2. Verify response status code
  3. Verify task was updated correctly

### 4. DELETE /api/tasks/:id

- **Description**: Delete existing task
- **Expected Response**: 200 OK
- **Test Steps**:
  1. Send DELETE request
  2. Verify response status code
  3. Verify task was removed

## Running Tests

```bash
    npm run test
    npm run test  npm run test tests/login.test.js
    npm run test  npm run test tests/readbyid-task.test.js
    npm run test  npm run test tests/create-task.test.js
    npm run test  npm run test tests/update-task.test.js
    npm run test  npm run test tests/delete-task.test.js
```
