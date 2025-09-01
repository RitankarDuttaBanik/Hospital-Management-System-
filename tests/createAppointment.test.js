const { createappointment } = require("../src/Controllers/appointmentController.js");
const prisma = require("../src/Config/Db");

jest.mock("../src/Config/Db", () => ({
  doctor: { findUnique: jest.fn() },
  patient: { findUnique: jest.fn() },
  appointment: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Appointment Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        doctorId: "doctor-1",
        patientId: "patient-1",
        startTime: "2025-09-01T12:00:00.000Z",
        endTime: "2025-09-01T12:30:00.000Z",
        reason: "Routine checkup",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create an appointment successfully", async () => {
    // mock doctor + patient exist
    prisma.doctor.findUnique.mockResolvedValue({ id: "doctor-1" });
    prisma.patient.findUnique.mockResolvedValue({ id: "patient-1" });

    // mock no overlapping appointment
    prisma.appointment.findFirst.mockResolvedValue(null);

    // mock appointment creation
    prisma.appointment.create.mockResolvedValue({
      id: "appointment-1",
      ...req.body,
    });

    await createappointment(req, res, next);

    expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
      where: { id: "doctor-1" },
    });

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: "patient-1" },
    });

    expect(prisma.appointment.findFirst).toHaveBeenCalled();

    expect(prisma.appointment.create).toHaveBeenCalledWith({
      data: {
        startTime: new Date("2025-09-01T12:00:00.000Z"),
        endTime: new Date("2025-09-01T12:30:00.000Z"),
        reason: "Routine checkup",
        doctor: { connect: { id: "doctor-1" } },
        patient: { connect: { id: "patient-1" } },
      },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "appointment-1",
      ...req.body,
    });
  });
});
