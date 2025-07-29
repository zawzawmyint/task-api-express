# Task API

A RESTful API for task management built with Node.js, Express, and PostgreSQL.

## Description

Task API is a robust backend service that allows you to create, read, update, and delete tasks. It provides endpoints for managing tasks with features like filtering by status, priority, and search terms.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM for database access
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Features

- Create, read, update, and delete tasks
- Filter tasks by status and priority
- Search tasks by title or description
- RESTful API design
- Error handling middleware
- Database integration with Prisma ORM

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zawzawmyint/task-api-express.git
   cd task-api-express
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   DATABASE_URL="postgresql://username:password@localhost:5432/task_db?schema=public"
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   JWT_EXPIRATION_TIME=30d

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/tasks` - Get all tasks (with optional filtering)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio to manage database
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## Test Documentation

- [Test Cases](TESTDOCUMENTATION.md)
