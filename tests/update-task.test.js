const request = require("supertest");
const app = require("../src/app"); // Adjust path to your Express app
const prisma = require("../prisma-client");
const jwt = require("jsonwebtoken");

describe("PUT /tasks/:id", () => {
  let testUser;
  let authToken;
  let testTask;

  beforeAll(async () => {
    // Create test user and generate token
    testUser = await prisma.user.create({
      data: {
        email: "taskupdater@example.com",
        password: "hashedPassword",
        name: "Task Updater",
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
        title: "Original Task",
        description: "Original Description",
        status: "PENDING",
        priority: "LOW",
        dueDate: new Date("2023-12-31"),
      },
    });
  });

  afterAll(async () => {
    // Clean up test data

    if (testTask) {
      await prisma.task.delete({
        where: {
          id: testTask.id,
        },
      });
    }
    if (testUser) {
      await prisma.user.delete({
        where: {
          id: testUser.id,
        },
      });
    }
    await prisma.$disconnect();
  });

  it("should update an existing task with valid data", async () => {
    const updateData = {
      title: "Updated Task Title",
      description: "Updated description",
      status: "COMPLETED",
      priority: "HIGH",
      dueDate: "2024-01-15",
    };

    const res = await request(app)
      .put(`/api/tasks/${testTask.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: testTask.id,
      title: updateData.title,
      description: updateData.description,
      status: updateData.status,
      priority: updateData.priority,
    });
  });

  it("should return 404 if task does not exist", async () => {
    const nonExistentId = "non-existent-id";
    const res = await request(app)
      .put(`/api/tasks/${nonExistentId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Should not update",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/task not found/i);
  });

  it("should return 401 if no auth token is provided", async () => {
    const res = await request(app).put(`/api/tasks/${testTask.id}`).send({
      title: "Unauthorized Update Attempt",
    });

    expect(res.statusCode).toBe(401);
  });
});
