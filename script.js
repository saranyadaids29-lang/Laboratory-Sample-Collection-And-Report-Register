// ===============================
// API URL
// ===============================

const API_URL = "http://127.0.0.1:3000/api/samples";

// ===============================
// DOM Elements
// ===============================

const tableBody = document.getElementById("tableBody");

const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("sampleModal");
const closeModal = document.getElementById("closeModal");

const sampleForm = document.getElementById("sampleForm");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalSamples = document.getElementById("totalSamples");
const pendingSamples = document.getElementById("pendingSamples");
const processedSamples = document.getElementById("processedSamples");
const reportReady = document.getElementById("reportReady");

let samples = [];
let editMode = false;
let editId = null;


// ===============================
// Open Modal
// ===============================

addBtn.addEventListener("click", () => {
    sampleForm.reset();

    editMode = false;
    editId = null;

    document.getElementById("sampleId").disabled = false;
    modal.style.display = "flex";
});


// ===============================
// Close Modal
// ===============================

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});


// ===============================
// Pending Days
// ===============================

function calculatePendingDays(collectedDate, status){
    if(status === "Report Ready" || status === "Delivered"){
        return 0;
    }

    const today = new Date();
    const collected = new Date(collectedDate);
    const diff = today - collected;

    return Math.floor(diff / (1000 * 60 * 60 * 24));
}


// ===============================
// Fetch All Samples
// ===============================

async function loadSamples(){
    try{
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to load samples. Server status: ${response.status}`);
        }

        samples = await response.json();
        displaySamples(samples);
        updateDashboard(samples);
    }
    catch(error){
        console.error("Load Samples Error:", error);
    }
}


// ===============================
// Display Samples
// ===============================

function displaySamples(data){
    tableBody.innerHTML = "";

    data.forEach(sample=>{
        const pending = calculatePendingDays(
            sample.collected_date,
            sample.status
        );

        tableBody.innerHTML += `
        <tr>
            <td>${sample.sample_id}</td>
            <td>${sample.patient_name}</td>
            <td>${sample.test_type}</td>
            <td>${sample.collected_date}</td>
            <td>
                <span class="status ${sample.status.toLowerCase().replace(/\s/g,'')}">
                    ${sample.status}
                </span>
            </td>
            <td>${pending}</td>
            <td>${sample.processed_date || "-"}</td>
            <td>${sample.report_issued_date || "-"}</td>
            <td>${sample.collected_by}</td>
            <td>
                <button
                    class="action-btn edit-btn"
                    onclick="editSample('${sample.sample_id}')">
                    Edit
                </button>
                <button
                    class="action-btn delete-btn"
                    onclick="deleteSample('${sample.sample_id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}


// ===============================
// Dashboard
// ===============================

function updateDashboard(data){
    totalSamples.textContent = data.length;

    pendingSamples.textContent =
        data.filter(s =>
            s.status === "Collected" ||
            s.status === "Processing"
        ).length;

    processedSamples.textContent =
        data.filter(s =>
            s.status === "Processed"
        ).length;

    reportReady.textContent =
        data.filter(s =>
            s.status === "Report Ready"
        ).length;
}


// ===============================
// Load Data Initially
// ===============================

loadSamples();


// ===============================
// Edit Sample
// ===============================

function editSample(sampleId){
    const sample = samples.find(s => s.sample_id === sampleId);

    if(!sample) return;

    editMode = true;
    editId = sampleId;

    document.getElementById("sampleId").value = sample.sample_id;
    document.getElementById("sampleId").disabled = true;

    document.getElementById("patientName").value = sample.patient_name;
    document.getElementById("testType").value = sample.test_type;
    document.getElementById("collectedDate").value = sample.collected_date;
    document.getElementById("status").value = sample.status;
    document.getElementById("processedDate").value = sample.processed_date || "";
    document.getElementById("reportIssuedDate").value = sample.report_issued_date || "";
    document.getElementById("collectedBy").value = sample.collected_by;

    modal.style.display = "flex";
}


// ===============================
// Save Sample (UPDATED WITH ERROR HANDLING)
// ===============================

sampleForm.addEventListener("submit", async function(e){
    e.preventDefault();

    // Standardize empty date inputs to null to avoid SQL/DB format errors
    const processedDateVal = document.getElementById("processedDate").value;
    const reportIssuedDateVal = document.getElementById("reportIssuedDate").value;

    const sample = {
        sample_id: document.getElementById("sampleId").value,
        patient_name: document.getElementById("patientName").value,
        test_type: document.getElementById("testType").value,
        collected_date: document.getElementById("collectedDate").value,
        status: document.getElementById("status").value,
        processed_date: processedDateVal ? processedDateVal : null,
        report_issued_date: reportIssuedDateVal ? reportIssuedDateVal : null,
        collected_by: document.getElementById("collectedBy").value
    };

    try{
        let response;

        if(editMode){
            response = await fetch(`${API_URL}/${editId}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sample)
            });
        }
        else{
            response = await fetch(API_URL,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sample)
            });
        }

        // Check if backend rejected request
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Server Error (${response.status})`);
        }

        alert(editMode ? "Sample Updated Successfully" : "Sample Added Successfully");

        modal.style.display = "none";
        sampleForm.reset();

        document.getElementById("sampleId").disabled = false;
        editMode = false;
        editId = null;

        loadSamples();

    }
    catch(error){
        console.error("Save Sample Error:", error);
        alert(`Unable to save sample: ${error.message}`);
    }
});


// ===============================
// Search Samples
// ===============================

searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = samples.filter(sample =>
        sample.sample_id.toLowerCase().includes(keyword) ||
        sample.patient_name.toLowerCase().includes(keyword) ||
        sample.test_type.toLowerCase().includes(keyword)
    );

    displaySamples(filtered);
    updateDashboard(filtered);
});


// ===============================
// Filter by Status
// ===============================

statusFilter.addEventListener("change", () => {
    const status = statusFilter.value;

    if(status === "All"){
        displaySamples(samples);
        updateDashboard(samples);
        return;
    }

    const filtered = samples.filter(sample =>
        sample.status === status
    );

    displaySamples(filtered);
    updateDashboard(filtered);
});


// ===============================
// Delete Sample
// ===============================

async function deleteSample(sampleId){
    const confirmDelete = confirm("Are you sure you want to delete this sample?");

    if(!confirmDelete){
        return;
    }

    try{
        const response = await fetch(`${API_URL}/${sampleId}`,{
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        alert("Sample Deleted Successfully");
        loadSamples();

    }
    catch(error){
        console.error("Delete Error:", error);
        alert(`Unable to delete sample: ${error.message}`);
    }
}


// ===============================
// Refresh Dashboard
// ===============================

function refreshDashboard(){
    loadSamples();
}


// ===============================
// Auto Refresh Every 30 Seconds
// ===============================

setInterval(() => {
    refreshDashboard();
}, 30000);


// ===============================
// Page Loaded
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loadSamples();
});