# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MySQL (local or cloud)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up Environment Variables

### Backend (.env file in backend folder)
Create `backend/.env`:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=skillshare-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `root` with your MySQL username
- `password` with your MySQL password
- `skillshare` with your database name

### Frontend (.env.local file in frontend folder)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Step 3: Set Up Database

### Create MySQL Database
```sql
CREATE DATABASE skillshare;
```

Or using MySQL command line:
```bash
mysql -u root -p -e "CREATE DATABASE skillshare;"
```

### Generate Prisma Client and Run Migrations
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate:dev
```

## Step 4: Start Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5001

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account
3. Fill in the form and submit
4. You should be redirected to the dashboard

## Troubleshooting

### "Database connection error"
- Make sure MySQL is running
- Check your DATABASE_URL in backend/.env
- Verify the database exists: `SHOW DATABASES;`
- Check MySQL user permissions

### "Cannot find module '@prisma/client'"
- Run `npm run prisma:generate` in the backend folder

### "Port already in use"
- Change PORT in backend/.env to a different port (e.g., 5002)
- Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly

### "Unknown database 'skillshare'"
- Create the database: `CREATE DATABASE skillshare;`

### Signup not working
- Check browser console for errors
- Check backend terminal for error messages
- Ensure MySQL is running and accessible
- Verify all environment variables are set correctly
- Make sure migrations have been run: `npm run prisma:migrate:dev`
