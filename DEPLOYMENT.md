# Deployment Guide

## Backend Deployment (Render/Railway)

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run prisma:generate && npm run prisma:migrate:deploy`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT` (auto-set by Render)
   - `NODE_ENV=production`
   - `JWT_SECRET` (generate a strong secret)
   - `JWT_EXPIRE=7d`
   - `DATABASE_URL` (your MySQL connection string)
   - `FRONTEND_URL` (your frontend URL)

### Railway Deployment

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add a MySQL service or use external MySQL
4. Set environment variables (same as Render)
5. Railway will auto-detect and deploy

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend API URL)
5. Deploy!

## Database Setup

### MySQL Cloud Services (Recommended for Production)

**Options:**
- **PlanetScale** (Serverless MySQL)
- **AWS RDS** (MySQL)
- **Google Cloud SQL** (MySQL)
- **DigitalOcean Managed Databases** (MySQL)

1. Create a MySQL database instance
2. Get your connection string
3. Update `DATABASE_URL` in your backend environment variables

**Example connection strings:**
```
# PlanetScale
DATABASE_URL=mysql://username:password@host.planetscale.com:3306/database?sslaccept=strict

# Standard MySQL
DATABASE_URL=mysql://username:password@host:3306/database
```

### Local MySQL

For local development, install MySQL and use:
```
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
```

## Post-Deployment

1. Run Prisma migrations on your production database:
   ```bash
   npm run prisma:migrate:deploy
   ```
2. Verify all environment variables are set correctly
3. Test API endpoints
4. Test frontend-backend connectivity

## Migration Commands

- **Development**: `npm run prisma:migrate:dev` (creates migration files)
- **Production**: `npm run prisma:migrate:deploy` (applies migrations without creating files)
