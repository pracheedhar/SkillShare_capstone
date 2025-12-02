# SkillShare Backend API

Express.js backend API for the SkillShare learning platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
FRONTEND_URL=http://localhost:3000
```

3. Create MySQL database:
```sql
CREATE DATABASE skillshare;
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate:dev
```

5. Start the development server:
```bash
npm run dev
```

## Prisma Studio

To view and manage your database:
```bash
npm run prisma:studio
```

## API Endpoints

See the main README.md for complete API documentation.

## Deployment

For deployment on Render or Railway:

1. Set environment variables in your hosting platform
2. Ensure MySQL connection string (DATABASE_URL) is set correctly
3. Run `npm run prisma:generate` and `npm run prisma:migrate:dev` during build
4. Start with `npm start`

