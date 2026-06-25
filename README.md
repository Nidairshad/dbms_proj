# Exams Database Dashboard

A simple REST API based dashboard for an exams database. The project uses Node.js, Express, PostgreSQL, HTML, and JavaScript.

It lets you view students, courses, faculty, marks, student marks, and batch-wise probation students. A student is considered on probation when their calculated CGPA is below `1.75`.

## This Project Contains

- rest api using Express.js
- PostgreSQL database connection
- Frontend dashboard using HTML and JavaScript
- Buttons to view:
  - Students
  - Courses
  - Faculty
  - Marks
  - Student marks
  - Batch-wise probation students
- Batch-wise probation calculation using marks, course credit hours, and grade GPA

## Database

This project includes `schema.sql`, which contains the PostgreSQL database structure only. It does not include sample data.

To create the database:

```bash
createdb -U postgres exams
psql -U postgres -d exams < schema.sql

```

## Project Structure

```text
project-folder/
│
├── main.js
├── db.js
├── package.json
├── schema.sql
│
└── public/
    ├── index.html
    └── script.js
```

Project Features
View all students
View all courses
View all faculty
View all marks
View student marks with student information
View probation students batch-wise

## how to run ?
## Install Dependencies

```bash
npm install
```

If you are creating the project from scratch, install these packages:

```bash
npm init -y
npm install express pg
```

## Database

This project includes `schema.sql`, which contains the PostgreSQL database structure only.

It does not include real student data. You can insert your own sample data after restoring the schema.

Create the database:

```bash
createdb -U postgres exams
```

Restore the schema:

```bash
psql -U postgres -d exams < schema.sql
```

## Local PostgreSQL Connection

Create a file named `db.js` in the project root:

```js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exams',
    password: 'your_password',
    port: 5432
});

export default pool;
```

Replace `your_password` with your PostgreSQL password.

## PostgreSQL In WSL Or Linux

If PostgreSQL is installed inside WSL/Linux, use this in `db.js`:

```js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exams',
    password: 'your_password',
    port: 5432
});

export default pool;
```

Make sure PostgreSQL is running:

```bash
sudo service postgresql start
```

Create database:

```bash
createdb -U postgres exams
```

Restore schema:

```bash
psql -U postgres -d exams < schema.sql
```

If you get peer authentication error, try:

```bash
sudo -u postgres createdb exams
sudo -u postgres psql -d exams < schema.sql
```

## PostgreSQL Installed On Windows But Project Running In WSL

If PostgreSQL is installed on Windows, but your Node project is running inside WSL, `localhost` may not always connect.

Find the Windows host IP from WSL:

```bash
cat /etc/resolv.conf
```

Look for:

```text
nameserver 172.xx.xx.xx
```

Use that IP as the host in `db.js`:

```js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: '172.xx.xx.xx',
    database: 'exams',
    password: 'your_password',
    port: 5432
});

export default pool;
```

Example:

```js
host: '172.22.64.1'
```

## Neon PostgreSQL Connection

If you are using Neon, create `db.js` like this:

```js
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: 'your_neon_database_url',
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
```

Your Neon connection string looks like this:

```text
postgresql://username:password@host.neon.tech/database?sslmode=require
```

Do not push your real Neon connection string to GitHub.

## Run The Project

Start the server:

```bash
node main.js
```

Open this URL in your browser:

```text
http://localhost:8001
```

## API Routes

```text
GET /students
GET /courses
GET /faculty
GET /marks
GET /student-marks
GET /probation-batches
GET /probation/:batchCode
```

## Probation Rule

A student is considered on probation when:

```text
CGPA < 1.75
```

The project calculates CGPA using:

```text
course marks
total marks
course credit hours
grade GPA
```

Since the schema does not contain a separate batch column, the batch is taken from the first two digits of the student registration number:

```sql
LEFT(regno, 2) AS batch_code
```

## Git Ignore

Do not push sensitive or unnecessary files.

Create a `.gitignore` file:

```gitignore
node_modules/
.env
db.js
```

## Push To GitHub

Initialize Git:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial commit"
```

Add GitHub remote:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
```

Rename branch to main:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

After the first push, future updates can be pushed with:

```bash
git add .
git commit -m "Update project"
git push
```

## Notes

The `db.js` file is ignored because it may contain database passwords or private connection strings.

If you want someone else to run the project, they should create their own `db.js` file using one of the examples above.
