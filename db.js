import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'exams',
    password: 'nida123',
    port: 5432
});

export default  pool;