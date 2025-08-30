const { createDoctor } = require("../src/Controllers/doctorController.js");
const prisma = require("../src/Config/Db.js");

jest.mock("../src/Config/Db.js", () => ({
    doctor : {
        create : jest.fn(),
    },
}));

describe("Doctor Controller", () => {
    let req,res,next

    beforeEach( () => {
       req = {
      body: {
        fullName: "Dr. Smith",
        speciality: "Cardiology",
        workStart: "09:00",
        workEnd: "17:00",
        slotMinutes: 30,
        userId: "user-2",
      },
    };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
         next = jest.fn();
        jest.clearAllMocks();
    });

    it("should create a doctor successfully", async () => {
         prisma.doctor.create.mockResolvedValue({
        id: "DOCTOR1",
        ...req.body,
        });

        await createDoctor(req,res,next);

        expect(prisma.doctor.create).toHaveBeenCalledWith({
            data : req.body
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: "DOCTOR1",
            ...req.body,
        });
    });
});
