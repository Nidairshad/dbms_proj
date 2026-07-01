import pool from "./db.js";

export async function getClasses(year, semester) {

    const result = await pool.query(
        `
        SELECT DISTINCT class
        FROM recap
        WHERE year = $1
        AND semester = $2
        ORDER BY class;
        `,
        [year, semester]
    );

    return result.rows;
}
