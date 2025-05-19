// /src/middlewares/error.middleware.js
/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Check if error is a Prisma error
  if (err.code && err.code.startsWith("P")) {
    // Prisma error code handling
    switch (err.code) {
      case "P2002": // Unique constraint failed
        return res.status(409).json({
          success: false,
          error: "A resource with this unique identifier already exists",
        });
      case "P2025": // Record not found
        return res.status(404).json({
          success: false,
          error: "Resource not found",
        });
      default:
        return res.status(500).json({
          success: false,
          error: "Database error occurred",
        });
    }
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};

module.exports = errorHandler;
