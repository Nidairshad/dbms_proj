function probationApp() {

    return {

        years: [],
        semesters: [],
        classes: [],
        students: [],

        selectedYear: "",
        selectedSemester: "",
        selectedClass: "",

        // -------------------------
        // Load Years
        // -------------------------

        async loadYears() {
            console.log("load years called");

            const response = await fetch("/years");

            this.years = await response.json();

        },

        // -------------------------
        // Select Year
        // -------------------------

        async selectYear(year) {

            this.selectedYear = year;

            this.selectedSemester = "";
            this.selectedClass = "";

            this.students = [];
            this.classes = [];

            const response = await fetch(`/semesters/${year}`);

            this.semesters = await response.json();

        },

        // -------------------------
        // Select Semester
        // -------------------------

        async selectSemester(semester) {

            this.selectedSemester = semester;

            this.selectedClass = "";

            this.students = [];

            const response = await fetch(
                `/classes/${this.selectedYear}/${semester}`
            );

            this.classes = await response.json();

        },

        // -------------------------
        // Select Class
        // -------------------------

        async selectClass(className) {

            this.selectedClass = className;

            const response = await fetch(

                `/probation?year=${this.selectedYear}` +
                `&semester=${this.selectedSemester}` +
                `&className=${encodeURIComponent(className)}`

            );

            this.students = await response.json();

        },

        // -------------------------
        // Reset
        // -------------------------

        reset() {

            this.selectedYear = "";
            this.selectedSemester = "";
            this.selectedClass = "";

            this.semesters = [];
            this.classes = [];
            this.students = [];

        }

    };

}
