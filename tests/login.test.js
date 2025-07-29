const request = require("supertest");
const app = require("../src/app"); // Adjust path to your Express app
const prisma = require("../prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("POST /login", () => {
  let testUser;
  const testPassword = "testPassword123";

  beforeAll(async () => {
    // Create a test user
    testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: await bcrypt.hash(testPassword, 10),
        name: "Test User",
        role: "USER",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.delete({
      where: {
        id: testUser.id,
      },
    });
    await prisma.$disconnect();
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: testPassword,
    });

    // expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toEqual({
      id: testUser.id,
      email: "test@example.com",
      name: "Test User",
      role: "USER",
    });

    // Verify the token is valid
    const decoded = jwt.verify(res.body.data.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(testUser.id);
  });

  it("should return 400 if email or password is missing", async () => {
    const res1 = await request(app)
      .post("/api/users/login")
      .send({ password: testPassword });

    expect(res1.statusCode).toBe(400);
    expect(res1.body.success).toBe(false);
    expect(res1.body.message).toMatch(/provide email and password/i);

    const res2 = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com" });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.success).toBe(false);
  });

  it("should return 401 for invalid credentials", async () => {
    const res1 = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: testPassword,
    });

    expect(res1.statusCode).toBe(401);
    expect(res1.body.success).toBe(false);
    expect(res1.body.message).toMatch(/invalid credentials/i);

    const res2 = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrongPassword",
    });

    expect(res2.statusCode).toBe(401);
    expect(res2.body.success).toBe(false);
  });
});
