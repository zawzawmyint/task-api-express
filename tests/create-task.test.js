const request = require("supertest");
const app = require("../src/app"); // Adjust path to your Express app
const prisma = require("../prisma-client");
const jwt = require("jsonwebtoken");

describe("POST /tasks", () => {
  let testUser;
  let testTask;
  let authToken;

  beforeAll(async () => {
    // Create a test user and generate token
    testUser = await prisma.user.create({
      data: {
        email: "taskcreator@example.com",
        password: "hashedPassword", // In real tests, hash this properly
        name: "Task Creator",
        role: "USER",
      },
    });

    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
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

  it("should create a new task with valid data", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      status: "pending",
      priority: "medium",
      dueDate: "2023-12-31",
    };

    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send(taskData);

    testTask = res.body.data;

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
    });
    expect(res.body.data).toHaveProperty("id");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        description: "Task without title",
        status: "PENDING",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/title is required/i);
  });

  it("should return 401 if no auth token is provided", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Unauthorized Task",
    });

    expect(res.statusCode).toBe(401);
  });
});
