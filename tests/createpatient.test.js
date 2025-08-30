const { createPatient } = require("../src/Controllers/patientController.js");
const prisma = require("../src/Config/Db.js");

jest.mock("../src/Config/Db", () => ({
  patient: {
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(), // mock user lookup
  },
}));

describe("Patient Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        fullName: "Jane Doe",
        age: 25,
        gender: "female",
        contactNumber: "1234567890",
        userId: "user-1",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a patient successfully", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "user-1", email: "test@example.com" });

    prisma.patient.create.mockResolvedValue({
      id: "PATIENT1",
      ...req.body,
    });

    await createPatient(req, res, next);

    expect(prisma.patient.create).toHaveBeenCalledWith({
      data: {
        fullName: "Jane Doe",
        age: 25,
        gender: "female",
        contactNumber: "1234567890",
        user: {
          connect: { id: "user-1" }, // ✅ match userId
        },
      },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "PATIENT1",
      ...req.body,
    });
  });
});
