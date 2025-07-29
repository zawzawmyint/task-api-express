// /src/services/task.service.js
const prisma = require("../../../prisma-client");

/**
 * Task service class that handles business logic for tasks
 */
class TaskService {
  /**
   * Create a new task
   * @param {Object} taskData - The task data
   * @returns {Promise<Object>} - The created task
   */
  async createTask(taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    return prisma.task.create({
      data: {
        title,
        description,
        status: status || "pending",
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
  }

  /**
   * Get all tasks with optional filtering
   * @param {Object} filters - Optional filters for tasks
   * @returns {Promise<Array>} - List of tasks
   */
  async getAllTasks(filters = {}) {
    const { status, priority, search } = filters;

    // Build filter conditions
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>} - The found task or null
   */
  async getTaskById(id) {
    return prisma.task.findUnique({
      where: { id: id },
    });
  }

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} taskData - The task data to update
   * @returns {Promise<Object>} - The updated task
   */
  async updateTask(id, taskData) {
    const { title, description, status, priority, dueDate } = taskData;

    // Prepare update data
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    return prisma.task.update({
      where: { id: id },
      data: updateData,
    });
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<Object>} - The deleted task
   */
  async deleteTask(id) {
    return prisma.task.delete({
      where: { id: id },
    });
  }

  /**
   * Check if a task exists
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} - True if task exists
   */
  async taskExists(id) {
    const count = await prisma.task.count({
      where: { id: id },
    });
    return count > 0;
  }
}

module.exports = new TaskService();
