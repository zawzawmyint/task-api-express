// /src/routes/task.routes.js
const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/task/task.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
// Task routes
router.post("/", authMiddleware, taskController.createTask);
router.get("/", authMiddleware, taskController.getAllTasks);
router.get("/:id", authMiddleware, taskController.getTaskById);
router.put("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
