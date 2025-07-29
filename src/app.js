// /src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const taskRoutes = require("./routes/task/task.route");
const userRoutes = require("./routes/user/user.route");
const errorHandler = require("./middlewares/error.middleware");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
// Adds request logging only in development mode.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API Routes
// Mounts the task routes under the /api/tasks path prefix.
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Task API is running",
    documentation: "/api/docs", // If you add API documentation later
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware (should be last)
// - Centralizes error handling logic in one place
// - Must be registered last to catch errors from all previous middleware and route
app.use(errorHandler);

module.exports = app;
