# 🏥 Hospital Management System (HMS)

A **Node.js + Express + Prisma** powered **Hospital Management System** with **JWT Authentication**, **Role-based Access Control (RBAC)**, and **Test-Driven Development (TDD)** using Jest & Supertest.  

---

## ✨ Features

✅ User Authentication (Register / Login)  
✅ Role-based Access (Admin, Doctor, Patient)  
✅ Secure Password Hashing with Bcrypt  
✅ JWT Authentication Middleware  
✅ Patient & Doctor Management  
✅ Appointment Scheduling  
✅ Prisma ORM with PostgreSQL (or MySQL/SQLite)  
✅ Unit & Integration Testing with Jest + Supertest  
✅ Structured Logging (pino/winston)  

---

## 🛠️ Tech Stack

- **Node.js** (v18+ recommended)
- **Express.js**
- **Prisma ORM**
- **PostgreSQL** (default, but can switch to MySQL/SQLite)
- **JWT** (JSON Web Token for auth)
- **Bcrypt.js** (password hashing)
- **Joi** (validation)
- **Jest + Supertest** (testing)

---

## 📂 Project Structure

HMS-Node-Prisma/
│── prisma/ # Prisma schema & migrations
│── src/
│ ├── Config/Db.js # Prisma client config
│ ├── Controllers/ # Auth, Patient, Doctor controllers
│ ├── Middlewares/ # Auth & validation middlewares
│ ├── Routes/ # Express route handlers
│ ├── Utils/ # Logger & helpers
│── tests/ # Jest + Supertest tests
│── .env # Environment variables
│── package.json
│── README.md


---

## ⚡ Installation & Setup

1️⃣ **Clone the repository**
```bash
git clone https://github.com/your-username/hms-node-prisma.git
cd hms-node-prisma
```
2️⃣Install dependencies
```bash
npm install
```
3️⃣ Setup environment variables
Create a .env file in root:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/hms"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
```
4️⃣ Run Prisma migrations
```bash
npx prisma migrate dev --name init
```
5️⃣ Start the server
```bash
npm run dev
```
🔑 API Endpoints
🔐 Auth

POST /api/auth/register → Register a new user

POST /api/auth/login → Login & get JWT token

👩‍⚕️ Patients

POST /api/patients → Create a patient (requires JWT)

GET /api/patients → Get all patients (admin/doctor only)

🧑‍⚕️ Doctors

POST /api/doctors → Create a doctor (requires JWT)

GET /api/doctors → Get doctors list

📅 Appointments

POST /api/appointments → Book an appointment

GET /api/appointments → View patient/doctor appointments

🧪 Testing (TDD)

We follow Test Driven Development (TDD).

Run all tests:

npm test


Example tested scenarios:

✅ Register new user

✅ Prevent duplicate registration

✅ Login with correct credentials

✅ Reject wrong password/email

✅ Token-based authorization

📸 Screenshots (Optional)

```
https://cryosat-explorer-36816759-1003164.postman.co/workspace/23d3007e-be7f-44b8-9433-60df917e616c/documentation/47002611-57ec2102-9163-45c9-99c0-5abb8a7d673e
```

🤝 Contributing

Fork the repo

Create a new branch (feature/your-feature)

Commit your changes

Push & create a PR 🚀

📜 License

This project is licensed under the MIT License.
