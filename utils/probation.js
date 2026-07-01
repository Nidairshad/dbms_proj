import pool from "./db.js";

export async function getProbationStudents(year, semester, className) {

    const result = await pool.query(`WITH course_result AS (

    SELECT
        s.regno,
        s.name,
        r.year,
        r.semester,
        r.class,
        c.cid,

        (c.theory + c.lab) AS credit_hours,

        SUM(m.marks) AS obtained_marks,
        SUM(d.total) AS total_marks

    FROM student s

    JOIN marks m
        ON s.regno = m.regno

    JOIN recap r
        ON r.rid = m.rid

    JOIN course c
        ON c.cid = r.cid

    JOIN dist d
        ON d.rid = m.rid
       AND d.hid = m.hid

    WHERE r.year = $1
      AND r.semester = $2
      AND r.class = $3

    GROUP BY
        s.regno,
        s.name,
        r.year,
        r.semester,
        r.class,
        c.cid,
        c.theory,
        c.lab
),

graded_result AS (

    SELECT
        cr.*,
        g.gpa

    FROM course_result cr

    JOIN grade g
      ON ROUND(
            (cr.obtained_marks / NULLIF(cr.total_marks, 0) * 100)::numeric,
            2
         )
      BETWEEN g.start AND g."end"
),

student_cgpa AS (

    SELECT
        regno,
        name,

        ROUND(
            SUM(gpa * credit_hours) / NULLIF(SUM(credit_hours), 0),
            2
        ) AS cgpa

    FROM graded_result

    GROUP BY
        regno,
        name
)

SELECT
    regno,
    name,
    cgpa
FROM student_cgpa
WHERE cgpa < 1.75
ORDER BY cgpa;`,[year, semester, className])

    return result.rows;
}
