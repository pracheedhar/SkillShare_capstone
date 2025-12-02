# SkillShare-Style Learning Platform

A modern e-learning platform inspired by SkillShare, where instructors can create and publish online courses, and students can learn new skills at their own pace.

## Features

- **Authentication & Authorization**: JWT-based login/signup with role-based access (Student/Instructor/Admin)
- **Course Management**: Full CRUD operations for courses, lessons, and quizzes
- **Filtering & Search**: Filter courses by category, difficulty, instructor with search and sort functionality
- **Dashboard**: Separate dashboards for instructors and students
- **Discussion Threads**: Real-time discussion boards for each course
- **Subscription System**: Monthly/yearly subscription plans for unlimited course access
- **Analytics**: Visual insights into student progress and instructor earnings

## Tech Stack

- **Frontend**: Next.js (JavaScript), React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: Vercel (Frontend), Render/Railway (Backend)

## Project Structure

```
SkillShare_capstone/
├── backend/          # Express.js API server
├── frontend/         # Next.js application
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database (local or cloud)
- npm or yarn

### Installation

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create MySQL database:
```sql
CREATE DATABASE skillshare;
```

4. Create a `.env` file:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
FRONTEND_URL=http://localhost:3000
```

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate:dev
```

6. Start the development server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Prisma Studio

To view and manage your database:
```bash
cd backend
npm run prisma:studio
```

This will open Prisma Studio at http://localhost:5555

## License

MIT

