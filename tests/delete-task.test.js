const request = require("supertest");
const app = require("../src/app"); // Adjust path to your Express app
const prisma = require("../prisma-client");
const jwt = require("jsonwebtoken");

describe("DELETE /tasks/:id", () => {
  let testUser;
  let authToken;
  let testTask;

  beforeAll(async () => {
    // Create test user and generate token
    testUser = await prisma.user.create({
      data: {
        email: "taskdeleter@example.com",
        password: "hashedPassword",
        name: "Task Deleter",
        role: "USER",
      },
    });

    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create a test task
    testTask = await prisma.task.create({
      data: {
        title: "Task to be deleted",
        description: "This task will be deleted",
        status: "pending",
        priority: "medium",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data

    // if (testTask) {
    //   await prisma.task.delete({
    //     where: {
    //       id: testTask.id,
    //     },
    //   });
    // }
    if (testUser) {
      await prisma.user.delete({
        where: {
          id: testUser.id,
        },
      });
    }
    await prisma.$disconnect();
  });

  it("should delete an existing task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${testTask.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
    expect(res.body.data).toEqual({});

    // Verify task is actually deleted
    const deletedTask = await prisma.task.findUnique({
      where: { id: testTask.id },
    });
    expect(deletedTask).toBeNull();
  });

  it("should return 404 if task does not exist", async () => {
    const nonExistentId = "non-existent-id";
    const res = await request(app)
      .delete(`/api/tasks/${nonExistentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/task not found/i);
  });

  it("should return 401 if no auth token is provided", async () => {
    const res = await request(app).delete(`/api/tasks/${testTask.id}`);

    expect(res.statusCode).toBe(401);
  });
});
