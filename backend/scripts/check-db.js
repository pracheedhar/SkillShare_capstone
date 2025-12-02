#!/usr/bin/env node

/**
 * Database Connection Checker
 * Run this script to verify your MySQL database connection
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n');
  
  // Check environment variable
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.error('Please set DATABASE_URL=mysql://user:password@host:3306/database');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL is set');
  console.log(`   Connection string: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);
  
  try {
    // Test connection
    console.log('🔄 Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Successfully connected to MySQL\n');
    
    // Test query
    console.log('🔄 Testing database query...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful\n');
    
    // Check if database exists and has tables
    console.log('🔄 Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    if (tables.length === 0) {
      console.log('⚠️  Database exists but has no tables');
      console.log('   Run: npm run prisma:migrate:dev\n');
    } else {
      console.log(`✅ Found ${tables.length} table(s) in database:`);
      tables.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
      console.log('');
    }
    
    console.log('✅ Database connection check passed!\n');
    await prisma.$disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n📋 Common issues and solutions:\n');
    
    if (error.code === 'P1001') {
      console.error('   Issue: Cannot reach database server');
      console.error('   Solution: Make sure MySQL is running');
      console.error('   - macOS: brew services start mysql');
      console.error('   - Linux: sudo systemctl start mysql');
      console.error('   - Windows: Start MySQL service\n');
    }
    
    if (error.code === 'P1000') {
      console.error('   Issue: Authentication failed');
      console.error('   Solution: Check your username and password in DATABASE_URL\n');
    }
    
    if (error.code === 'P1003') {
      console.error('   Issue: Database does not exist');
      console.error('   Solution: Create the database:');
      console.error('   mysql -u root -p -e "CREATE DATABASE skillshare;"\n');
    }
    
    if (error.code === 'P1017') {
      console.error('   Issue: Server closed the connection');
      console.error('   Solution: Check MySQL server status and restart if needed\n');
    }
    
    console.error('   General troubleshooting:');
    console.error('   1. Verify MySQL is running: mysql -u root -p');
    console.error('   2. Check DATABASE_URL format: mysql://user:password@host:port/database');
    console.error('   3. Create database: CREATE DATABASE skillshare;');
    console.error('   4. Run migrations: npm run prisma:migrate:dev\n');
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkDatabase();

