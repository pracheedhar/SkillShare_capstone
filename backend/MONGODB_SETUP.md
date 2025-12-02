# MongoDB Setup Instructions

## Important: Update MONGODB_URI

The `.env` file has been created with a placeholder:
```
MONGODB_URI=YOUR_MONGO_URI_HERE
```

**You MUST replace this with your actual MongoDB connection string before running the server.**

## MongoDB Connection Strings

### Local MongoDB
If you have MongoDB running locally:
```
MONGODB_URI=mongodb://localhost:27017/skillshare
```

### MongoDB Atlas (Cloud)
If you're using MongoDB Atlas, your connection string will look like:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillshare?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB username
- `password` with your MongoDB password
- `cluster` with your cluster name

## Setting Up Database Schema

**For MongoDB, use `db push` instead of `migrate`:**

```bash
npm run prisma:db:push
```

Or:
```bash
npx prisma db push
```

This will sync your Prisma schema with your MongoDB database.

## Steps to Get Started

1. **Update `.env` file** with your actual MongoDB URI
2. **Run Prisma generate:**
   ```bash
   npm run prisma:generate
   ```
3. **Push schema to database:**
   ```bash
   npm run prisma:db:push
   ```
4. **Start the server:**
   ```bash
   npm run dev
   ```

## Note

MongoDB doesn't use traditional migrations like SQL databases. Instead, Prisma uses `db push` to sync your schema directly with the database.

