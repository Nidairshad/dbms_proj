const tableContainer = document.getElementById('tableContainer');
const batchButtons = document.getElementById('batchButtons');

function render(data) {
    tableContainer.innerHTML = "";

    if (!Array.isArray(data)) {
        tableContainer.textContent = JSON.stringify(data);
        return;
    }

    if (data.length === 0) {
        tableContainer.textContent = "No records found";
        return;
    }

    const table = document.createElement('table');
    table.border = "1";
    table.cellPadding = "8";
    table.cellSpacing = "0";

    const columns = Object.keys(data[0]);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach(item => {
        const row = document.createElement('tr');

        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column];
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

async function fetchJson(url) {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

async function loadStudents() {
    const data = await fetchJson('/students');
    render(data);
}

async function loadCourses() {
    const data = await fetchJson('/courses');
    render(data);
}

async function loadMarks() {
    const data = await fetchJson('/marks');
    render(data);
}

async function loadFaculty() {
    const data = await fetchJson('/faculty');
    render(data);
}

async function loadStudentMarks() {
    const data = await fetchJson('/student-marks');
    render(data);
}

async function loadProbationBatches() {
    const data = await fetchJson('/probation-batches');

    batchButtons.innerHTML = "";

    data.forEach(batch => {
        const button = document.createElement('button');
        button.textContent = `Batch ${batch.batch_code} (${batch.probation_students})`;
        button.onclick = () => loadProbationStudents(batch.batch_code);
        batchButtons.appendChild(button);
    });

    render(data);
}

async function loadProbationStudents(batchCode) {
    const data = await fetchJson(`/probation/${batchCode}`);
    render(data);
}