// /src/prisma-client.js
const { PrismaClient } = require("./src/generated/prisma");

// Create a global prisma instance
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

module.exports = prisma;
