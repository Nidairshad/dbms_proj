import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import pool from "./db.js"

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.static('public'));

app.get('/courses', async (req, res) => {
    const result = await pool.query('SELECT * FROM course');
    res.json(result.rows);
});

app.get('/faculty', async (req, res) => {
    const result = await pool.query('SELECT * FROM faculty');
    res.json(result.rows);
});

app.get('/marks', async (req, res) => {
    const result = await pool.query('SELECT * FROM marks');
    res.json(result.rows);
});

app.get('/students', async (req, res) => {
    const result = await pool.query('SELECT * FROM student');
    res.json(result.rows);
});

app.get('/student-marks', async (req, res) => {
    const result = await pool.query(`
        SELECT 
            s.regno,
            s.name,
            m.mid,
            m.hid,
            m.marks,
            m.rid
        FROM student s
        JOIN marks m ON s.regno = m.regno
    `);

    res.json(result.rows);
});

app.get('/probation-batches', async (req, res) => {
    const result = await pool.query(`
        WITH course_result AS (
            SELECT
                s.regno,
                s.name,
                LEFT(s.regno, 2) AS batch_code,
                c.cid,
                (COALESCE(c.theory, 0) + COALESCE(c.lab, 0)) AS credit_hours,
                SUM(m.marks) AS obtained_marks,
                SUM(d.total) AS total_marks
            FROM student s
            JOIN marks m ON m.regno = s.regno
            JOIN recap r ON r.rid = m.rid
            JOIN course c ON c.cid = r.cid
            JOIN dist d ON d.rid = m.rid AND d.hid = m.hid
            GROUP BY
                s.regno, s.name, c.cid, c.theory, c.lab
        ),
        graded_result AS (
            SELECT
                cr.*,
                g.gpa
            FROM course_result cr
            JOIN grade g
                ON ROUND((cr.obtained_marks / NULLIF(cr.total_marks, 0) * 100)::numeric, 2)
                   BETWEEN g.start AND g."end"
        ),
        student_cgpa AS (
            SELECT
                batch_code,
                regno,
                name,
                ROUND(
                    SUM(gpa * credit_hours) / NULLIF(SUM(credit_hours), 0),
                    2
                ) AS cgpa
            FROM graded_result
            GROUP BY batch_code, regno, name
        )
        SELECT
            batch_code,
            COUNT(*) AS probation_students
        FROM student_cgpa
        WHERE cgpa < 1.75
        GROUP BY batch_code
        ORDER BY batch_code
    `);

    res.json(result.rows);
});

app.get('/probation/:batchCode', async (req, res) => {
    const { batchCode } = req.params;

    const result = await pool.query(`
        WITH course_result AS (
            SELECT
                s.regno,
                s.name,
                LEFT(s.regno, 2) AS batch_code,
                c.cid,
                (COALESCE(c.theory, 0) + COALESCE(c.lab, 0)) AS credit_hours,
                SUM(m.marks) AS obtained_marks,
                SUM(d.total) AS total_marks
            FROM student s
            JOIN marks m ON m.regno = s.regno
            JOIN recap r ON r.rid = m.rid
            JOIN course c ON c.cid = r.cid
            JOIN dist d ON d.rid = m.rid AND d.hid = m.hid
            WHERE LEFT(s.regno, 2) = $1
            GROUP BY
                s.regno, s.name, c.cid, c.theory, c.lab
        ),
        graded_result AS (
            SELECT
                cr.*,
                g.gpa
            FROM course_result cr
            JOIN grade g
                ON ROUND((cr.obtained_marks / NULLIF(cr.total_marks, 0) * 100)::numeric, 2)
                   BETWEEN g.start AND g."end"
        ),
        student_cgpa AS (
            SELECT
                batch_code,
                regno,
                name,
                ROUND(
                    SUM(gpa * credit_hours) / NULLIF(SUM(credit_hours), 0),
                    2
                ) AS cgpa
            FROM graded_result
            GROUP BY batch_code, regno, name
        )
        SELECT
            batch_code,
            regno,
            name,
            cgpa
        FROM student_cgpa
        WHERE cgpa < 1.75
        ORDER BY regno
    `, [batchCode]);

    res.json(result.rows);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});