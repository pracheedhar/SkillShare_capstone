#!/usr/bin/env node

/**
 * Database Setup Helper
 * Helps configure MySQL connection and create database
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('🔧 MySQL Database Setup Helper\n');
  console.log('This script will help you configure your MySQL connection.\n');

  // Check if MySQL is installed
  try {
    execSync('mysql --version', { stdio: 'ignore' });
    console.log('✅ MySQL is installed\n');
  } catch (error) {
    console.error('❌ MySQL is not installed or not in PATH');
    console.error('   Install MySQL: brew install mysql (macOS)');
    console.error('   Or download from: https://dev.mysql.com/downloads/mysql/\n');
    rl.close();
    process.exit(1);
  }

  // Test MySQL connection
  console.log('📋 Testing MySQL connection...\n');
  
  let username = 'root';
  let password = '';
  let host = 'localhost';
  let port = '3306';
  let database = 'skillshare';

  // Get MySQL credentials
  console.log('Please enter your MySQL credentials:');
  username = await question('MySQL Username [root]: ') || 'root';
  password = await question('MySQL Password: ');
  host = await question(`MySQL Host [${host}]: `) || host;
  port = await question(`MySQL Port [${port}]: `) || port;

  // Test connection
  console.log('\n🔄 Testing connection...');
  try {
    const testCmd = `mysql -u ${username} -p${password} -h ${host} -P ${port} -e "SELECT 1" 2>&1`;
    execSync(testCmd, { stdio: 'ignore' });
    console.log('✅ MySQL connection successful!\n');
  } catch (error) {
    console.error('❌ MySQL connection failed!');
    console.error('   Please check your credentials and make sure MySQL is running.\n');
    console.error('   Common issues:');
    console.error('   - Wrong password');
    console.error('   - MySQL not running (start with: brew services start mysql)');
    console.error('   - Wrong host/port\n');
    rl.close();
    process.exit(1);
  }

  // Check if database exists
  console.log('🔄 Checking if database exists...');
  try {
    const checkDbCmd = `mysql -u ${username} -p${password} -h ${host} -P ${port} -e "SHOW DATABASES LIKE '${database}'" 2>&1`;
    const result = execSync(checkDbCmd, { encoding: 'utf-8' });
    
    if (result.includes(database)) {
      console.log(`✅ Database '${database}' already exists\n`);
    } else {
      console.log(`⚠️  Database '${database}' does not exist`);
      const create = await question(`Create database '${database}'? (y/n): `);
      if (create.toLowerCase() === 'y') {
        try {
          const createDbCmd = `mysql -u ${username} -p${password} -h ${host} -P ${port} -e "CREATE DATABASE ${database}" 2>&1`;
          execSync(createDbCmd, { stdio: 'ignore' });
          console.log(`✅ Database '${database}' created successfully\n`);
        } catch (error) {
          console.error(`❌ Failed to create database: ${error.message}\n`);
          rl.close();
          process.exit(1);
        }
      } else {
        console.log('⚠️  Skipping database creation. You may need to create it manually.\n');
      }
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    rl.close();
    process.exit(1);
  }

  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  const databaseUrl = `mysql://${username}:${password}@${host}:${port}/${database}`;
  
  console.log('📝 Updating .env file...');
  
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Update or add DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL=${databaseUrl}`);
    } else {
      envContent += `\nDATABASE_URL=${databaseUrl}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!\n');
    console.log(`   DATABASE_URL=${databaseUrl.replace(/:[^:@]+@/, ':****@')}\n`);
  } catch (error) {
    console.error('❌ Failed to update .env file:', error.message);
    console.error(`\n   Please manually set DATABASE_URL in backend/.env:`);
    console.error(`   DATABASE_URL=${databaseUrl}\n`);
  }

  // Run Prisma generate and migrate
  console.log('🔄 Running Prisma setup...\n');
  try {
    console.log('   Generating Prisma client...');
    execSync('npm run prisma:generate', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    
    console.log('\n   Running migrations...');
    execSync('npm run prisma:migrate:dev', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    
    console.log('\n✅ Database setup complete!\n');
  } catch (error) {
    console.error('\n⚠️  Prisma setup had errors. You may need to run manually:');
    console.error('   npm run prisma:generate');
    console.error('   npm run prisma:migrate:dev\n');
  }

  rl.close();
  console.log('🎉 Setup complete! You can now start your server with: npm run dev\n');
}

setupDatabase().catch(error => {
  console.error('❌ Setup failed:', error);
  rl.close();
  process.exit(1);
});

