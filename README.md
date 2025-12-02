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
- **Database**: MongoDB with Prisma ORM
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
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Set up environment variables
4. Run Prisma migrations
5. Start development servers

## License

MIT

