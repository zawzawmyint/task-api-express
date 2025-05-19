// /src/controllers/task.controller.js
const taskService = require("../../services/task/task.service");

/**
 * Task controller to handle HTTP requests related to tasks
 */
class TaskController {
  /**
   * Create a new task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createTask(req, res, next) {
    console.log("createTask", req.body);
    try {
      const { title, description, status, priority, dueDate } = req.body;

      // Basic validation
      if (!title) {
        return res.status(400).json({
          success: false,
          error: "Task title is required",
        });
      }

      const task = await taskService.createTask({
        title,
        description,
        status,
        priority,
        dueDate,
      });

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks with optional filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllTasks(req, res, next) {
    try {
      const { status, priority, search } = req.query;

      const tasks = await taskService.getAllTasks({
        status,
        priority,
        search,
      });

      res.json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific task by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;

      const task = await taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      console.log("updateTask", id);
      const { title, description, status, priority, dueDate } = req.body;

      // Check if task exists
      const exists = await taskService.taskExists(id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      const updatedTask = await taskService.updateTask(id, {
        title,
        description,
        status,
        priority,
        dueDate,
      });

      res.json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;

      // Check if task exists
      const exists = await taskService.taskExists(id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      await taskService.deleteTask(id);

      res.json({
        success: true,
        data: {},
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
