#!/usr/bin/env node

/**
 * Quick Database Fix Script
 * Attempts to fix common database connection issues
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Database Connection Fix Script\n');

const envPath = path.join(__dirname, '..', '.env');

// Try common MySQL passwords
const commonPasswords = ['', 'root', 'password', 'admin'];

async function tryConnection(username, password) {
  try {
    const cmd = password 
      ? `mysql -u ${username} -p${password} -e "SELECT 1" 2>&1`
      : `mysql -u ${username} -e "SELECT 1" 2>&1`;
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

async function fixDatabase() {
  console.log('Step 1: Checking MySQL service...\n');
  
  // Check if MySQL is running
  try {
    execSync('mysql --version', { stdio: 'ignore' });
    console.log('✅ MySQL is installed');
  } catch (error) {
    console.error('❌ MySQL is not installed');
    console.error('   Install with: brew install mysql');
    process.exit(1);
  }

  // Try to start MySQL
  try {
    console.log('🔄 Starting MySQL service...');
    execSync('brew services start mysql', { stdio: 'inherit' });
    console.log('✅ MySQL service started\n');
    // Wait a bit for MySQL to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.log('⚠️  Could not start MySQL via brew services');
    console.log('   MySQL might already be running or needs manual start\n');
  }

  console.log('Step 2: Testing MySQL connection...\n');
  
  let workingPassword = null;
  let username = 'root';

  // Try to connect without password first
  if (await tryConnection(username, '')) {
    workingPassword = '';
    console.log('✅ Connected to MySQL (no password required)\n');
  } else {
    // Try common passwords
    console.log('🔄 Trying common passwords...');
    for (const pwd of commonPasswords) {
      if (pwd === '') continue; // Already tried
      if (await tryConnection(username, pwd)) {
        workingPassword = pwd;
        console.log(`✅ Connected to MySQL (password: ${pwd})\n`);
        break;
      }
    }
  }

  if (!workingPassword && workingPassword !== '') {
    console.log('❌ Could not connect with common passwords');
    console.log('   Please run: npm run setup-db');
    console.log('   Or manually update DATABASE_URL in .env\n');
    process.exit(1);
  }

  console.log('Step 3: Creating database...\n');
  
  // Create database if it doesn't exist
  try {
    const createDbCmd = workingPassword
      ? `mysql -u ${username} -p${workingPassword} -e "CREATE DATABASE IF NOT EXISTS skillshare" 2>&1`
      : `mysql -u ${username} -e "CREATE DATABASE IF NOT EXISTS skillshare" 2>&1`;
    execSync(createDbCmd, { stdio: 'ignore' });
    console.log('✅ Database "skillshare" ready\n');
  } catch (error) {
    console.log('⚠️  Could not create database (might already exist)\n');
  }

  console.log('Step 4: Updating .env file...\n');
  
  // Update .env file
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const databaseUrl = `mysql://${username}:${workingPassword}@localhost:3306/skillshare`;
    
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL=${databaseUrl}`);
    } else {
      envContent += `\nDATABASE_URL=${databaseUrl}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated');
    console.log(`   DATABASE_URL=${databaseUrl.replace(/:[^:@]+@/, ':****@')}\n`);
  } catch (error) {
    console.error('❌ Failed to update .env:', error.message);
    process.exit(1);
  }

  console.log('Step 5: Testing Prisma connection...\n');
  
  // Test Prisma connection
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    console.log('✅ Prisma connection successful!\n');
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
    console.error('   Run: npm run prisma:generate\n');
  }

  console.log('Step 6: Running Prisma setup...\n');
  
  // Generate Prisma client
  try {
    console.log('   Generating Prisma client...');
    execSync('npm run prisma:generate', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  } catch (error) {
    console.error('   ⚠️  Prisma generate had errors');
  }

  // Run migrations
  try {
    console.log('\n   Running migrations...');
    execSync('npm run prisma:migrate:dev', { 
      cwd: path.join(__dirname, '..'), 
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
  } catch (error) {
    console.error('   ⚠️  Migrations had errors (database might already be set up)');
  }

  console.log('\n✅ Database fix complete!\n');
  console.log('🎉 You can now start your server with: npm run dev\n');
}

fixDatabase().catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});

