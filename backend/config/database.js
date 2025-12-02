const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test database connection (async, won't block server startup)
let isConnected = false;

(async () => {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('✅ MySQL database connected successfully');
    
    // Test query to verify database is accessible
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test passed');
  } catch (error) {
    isConnected = false;
    console.error('❌ Database connection error:', error.message);
    console.error('Error details:', error);
    console.error('\n📋 Troubleshooting steps:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check DATABASE_URL in .env file');
    console.error('3. Verify database exists: CREATE DATABASE skillshare;');
    console.error('4. Run migrations: npm run prisma:migrate:dev');
    console.error('5. Check MySQL user permissions\n');
  }
})();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
module.exports.isConnected = () => isConnected;

