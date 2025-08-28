const { register } = require("../src/Controllers/authController");
const prisma = require("../src/Config/Db"); // your Prisma instance
const bcrypt = require("bcryptjs");

jest.mock("../src/Config/Db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

describe("Register User ", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
        role: "patient",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    prisma.user.findUnique.mockResolvedValue(null); 
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    prisma.user.create.mockResolvedValue({
      id: "1",
      email: "test@example.com",
      role: "PATIENT",
    });

    await register(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { 
        email: req.body.email 
            },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        password: "hashedPassword123",
        role: "PATIENT",
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });

  it("should not allow duplicate user creation", async () => {
    prisma.user.findUnique.mockResolvedValue(
        { 
            id: "1", 
            email: req.body.email 
        });

    await register(req, res, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "User already exists",
    });
  });

  it("should handle unexpected errors", async () => {
    const error = new Error("DB crash");
    prisma.user.findUnique.mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

