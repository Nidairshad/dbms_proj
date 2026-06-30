import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "your username here",
  password: "your postgres password here",
  database: "your database name here - (Eg:exams)",
});

export default pool;
