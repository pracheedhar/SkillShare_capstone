const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test database connection (async, won't block server startup)
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ MySQL database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Make sure MySQL is running and DATABASE_URL is set correctly');
  }
})();

module.exports = prisma;

