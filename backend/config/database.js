const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test database connection (async, won't block server startup)
(async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Make sure MongoDB is running and MONGODB_URI is set correctly');
  }
})();

module.exports = prisma;

