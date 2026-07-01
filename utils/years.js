import pool from "./db.js";

export async function getYears() {
    const result = await pool.query(`
        SELECT DISTINCT year
        FROM recap
        ORDER BY year;
    `);

    return result.rows;
}
