import pool from "./db.js";

export async function getSemesters(year) {

    const result = await pool.query(
        `
        SELECT DISTINCT semester
        FROM recap
        WHERE year = $1
        ORDER BY semester;
        `,
        [year]
    );

    return result.rows;
}
