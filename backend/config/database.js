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
    
    // Provide specific error messages
    if (error.code === 'P1000') {
      console.error('\n🔐 Authentication Error:');
      console.error('   The MySQL username or password is incorrect.');
      console.error('   Run: npm run setup-db');
      console.error('   Or update DATABASE_URL in .env with correct credentials\n');
    } else if (error.code === 'P1001') {
      console.error('\n🔌 Connection Error:');
      console.error('   Cannot reach MySQL server.');
      console.error('   Make sure MySQL is running:');
      console.error('   - macOS: brew services start mysql');
      console.error('   - Linux: sudo systemctl start mysql');
      console.error('   - Windows: Start MySQL service\n');
    } else if (error.code === 'P1003') {
      console.error('\n📦 Database Not Found:');
      console.error('   Database "skillshare" does not exist.');
      console.error('   Create it: CREATE DATABASE skillshare;');
      console.error('   Or run: npm run setup-db\n');
    } else {
      console.error('\n📋 Troubleshooting steps:');
      console.error('1. Run database setup: npm run setup-db');
      console.error('2. Check MySQL is running');
      console.error('3. Verify DATABASE_URL in .env file');
      console.error('4. Test connection: npm run check-db\n');
    }
  }
})();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
module.exports.isConnected = () => isConnected;

