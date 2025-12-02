#!/usr/bin/env node

/**
 * Server Startup Script
 * Checks prerequisites before starting the server
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.error('   Please set DATABASE_URL=mysql://user:password@host:3306/database\n');
    process.exit(1);
  }
  
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in .env file');
    console.error('   Please set JWT_SECRET=your-secret-key\n');
    process.exit(1);
  }
  
  console.log('✅ Environment variables configured\n');
  
  // Check database connection
  try {
    console.log('🔄 Testing database connection...');
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful\n');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('   Error:', error.message);
    console.error('\n📋 Please check:');
    console.error('   1. MySQL is running');
    console.error('   2. DATABASE_URL is correct');
    console.error('   3. Database exists: CREATE DATABASE skillshare;');
    console.error('   4. Run migrations: npm run prisma:migrate:dev\n');
    await prisma.$disconnect();
    process.exit(1);
  }
  
  await prisma.$disconnect();
  console.log('✅ All checks passed! Starting server...\n');
}

checkPrerequisites().then(() => {
  // Start the server
  require('../server');
}).catch((error) => {
  console.error('❌ Startup check failed:', error);
  process.exit(1);
});

