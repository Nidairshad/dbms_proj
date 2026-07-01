import express from "express";

import { getYears } from "./utils/years.js";
import { getSemesters } from "./utils/semesters.js";
import { getClasses } from "./utils/classes.js";
import { getProbationStudents } from "./utils/probation.js";

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.static("public"));
app.use(express.json());

/* ---------------- Years ---------------- */

app.get("/years", async (req, res) => {
    try {
        const years = await getYears();
        res.json(years);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch years"
        });
    }
});

/* ---------------- Semesters ---------------- */

app.get("/semesters/:year", async (req, res) => {

    try {

        const { year } = req.params;

        const semesters = await getSemesters(year);

        res.json(semesters);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch semesters"
        });

    }

});

/* ---------------- Classes ---------------- */

app.get("/classes/:year/:semester", async (req, res) => {

    try {

        const { year, semester } = req.params;

        const classes = await getClasses(year, semester);

        res.json(classes);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch classes"
        });

    }

});

/* ---------------- Probation ---------------- */

app.get("/probation", async (req, res) => {

    try {

        const { year, semester, className } = req.query;

        const students = await getProbationStudents(
            year,
            semester,
            className
        );

        res.json(students);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch probation students"
        });

    }

});

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});
