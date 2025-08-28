const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { login } = require("../src/Controllers/authController.js");
const prisma = require("../src/Config/Db");


jest.mock("../src/Config/Db", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));
jest.mock("bcryptjs", () => ({
    compare : jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign  : jest.fn(),
}));

describe("User Login", () => {
    let req,res,next

    beforeEach( () => {
        req = {
            body : {
                email : "test@example.com",
                password : "password123",
            },
        };

        res = {
            status : jest.fn().mockReturnThis(),
            json  : jest.fn(),
        };

        next = jest.fn(),
        jest.clearAllMocks()
    });

    it("login user and return token", async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: "1",
                email: "test@example.com",
                password: "hashedPassword",
                role: "PATIENT",
            });

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mockedToken");


            await login(req,res,next);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where : {
                    email :"test@example.com"
                },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
            expect(jwt.sign).toHaveBeenCalledWith({
                 userId: "1", 
                 role: "PATIENT"
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            expect(res.status).toHaveBeenCalledWith(200);
             expect(res.json).toHaveBeenCalledWith({
                    token: "mockedToken",
                        user: {
                            id: "1",
                            email: "test@example.com",
                            role: "PATIENT",
                            },
                    });
            });
});