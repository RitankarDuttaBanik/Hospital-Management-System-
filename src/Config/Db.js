const { PrismaClient } = require("../generated/prisma");


const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // helpful during dev
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;