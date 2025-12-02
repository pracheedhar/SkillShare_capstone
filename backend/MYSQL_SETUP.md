# MySQL Setup Instructions

## Important: Update DATABASE_URL

The `.env` file has been created with a placeholder:
```
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
```

**You MUST replace this with your actual MySQL connection string before running the server.**

## MySQL Connection Strings

### Local MySQL
If you have MySQL running locally:
```
DATABASE_URL=mysql://username:password@localhost:3306/skillshare
```

Replace:
- `username` with your MySQL username (default: `root`)
- `password` with your MySQL password
- `skillshare` with your database name

### Example Connection Strings

**Local MySQL with root user:**
```
DATABASE_URL=mysql://root:yourpassword@localhost:3306/skillshare
```

**MySQL with custom user:**
```
DATABASE_URL=mysql://myuser:mypassword@localhost:3306/skillshare
```

**Remote MySQL:**
```
DATABASE_URL=mysql://username:password@host:3306/skillshare
```

## Setting Up Database

### 1. Create the Database

First, create the database in MySQL:

```sql
CREATE DATABASE skillshare;
```

Or using MySQL command line:
```bash
mysql -u root -p -e "CREATE DATABASE skillshare;"
```

### 2. Run Prisma Migrations

**For MySQL, use `migrate` (not `db push`):**

```bash
npm run prisma:migrate:dev
```

Or:
```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables in your MySQL database
- Set up all relationships and constraints
- Create migration files for version control

## Steps to Get Started

1. **Create MySQL database:**
   ```sql
   CREATE DATABASE skillshare;
   ```

2. **Update `.env` file** with your actual MySQL connection string

3. **Run Prisma generate:**
   ```bash
   npm run prisma:generate
   ```

4. **Run migrations:**
   ```bash
   npm run prisma:migrate:dev
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Prisma Studio

To view and manage your database:
```bash
npm run prisma:studio
```

This will open Prisma Studio at http://localhost:5555

## Troubleshooting

### "Access denied for user"
- Check your MySQL username and password
- Ensure the user has permissions to create databases and tables

### "Unknown database 'skillshare'"
- Create the database first: `CREATE DATABASE skillshare;`

### "Table already exists"
- If you're switching from MongoDB, you may need to drop existing tables
- Or use a fresh database name

