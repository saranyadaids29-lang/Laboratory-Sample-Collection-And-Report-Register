const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Create database folder if it doesn't exist
const dbFolder = path.join(__dirname, "database");

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

// Database path
const dbPath = path.join(dbFolder, "lab.db");

// Connect to SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite Database");
    }
});

// Create Samples Table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS samples (
            sample_id TEXT PRIMARY KEY,
            patient_name TEXT NOT NULL,
            test_type TEXT NOT NULL,
            collected_date TEXT NOT NULL,
            status TEXT NOT NULL,
            processed_date TEXT,
            report_issued_date TEXT,
            collected_by TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.log("❌ Table Creation Failed");
            console.error(err.message);
        } else {
            console.log("✅ Samples table ready");
        }
    });
});

// ======================================
// GET ALL SAMPLES
// ======================================

app.get("/api/samples", (req, res) => {

    db.all("SELECT * FROM samples ORDER BY collected_date DESC", [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);

    });

});


// ======================================
// ADD NEW SAMPLE
// ======================================

app.post("/api/samples", (req, res) => {

    const {
        sample_id,
        patient_name,
        test_type,
        collected_date,
        status,
        processed_date,
        report_issued_date,
        collected_by
    } = req.body;

    const sql = `

    INSERT INTO samples(

        sample_id,
        patient_name,
        test_type,
        collected_date,
        status,
        processed_date,
        report_issued_date,
        collected_by

    )

    VALUES(?,?,?,?,?,?,?,?)

    `;

    db.run(

        sql,

        [

            sample_id,
            patient_name,
            test_type,
            collected_date,
            status,
            processed_date,
            report_issued_date,
            collected_by

        ],

        function(err){

            if(err){

                return res.status(500).json({
                    error:err.message
                });

            }

            res.json({

                message:"Sample Added Successfully"

            });

        }

    );

});


// ======================================
// UPDATE SAMPLE
// ======================================

app.put("/api/samples/:id", (req, res) => {

    const id = req.params.id;

    const {
        patient_name,
        test_type,
        collected_date,
        status,
        processed_date,
        report_issued_date,
        collected_by
    } = req.body;

    const sql = `
        UPDATE samples
        SET
            patient_name = ?,
            test_type = ?,
            collected_date = ?,
            status = ?,
            processed_date = ?,
            report_issued_date = ?,
            collected_by = ?
        WHERE sample_id = ?
    `;

    db.run(
        sql,
        [
            patient_name,
            test_type,
            collected_date,
            status,
            processed_date,
            report_issued_date,
            collected_by,
            id
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Sample Updated Successfully"
            });

        }
    );

});


// ======================================
// DELETE SAMPLE
// ======================================

app.delete("/api/samples/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM samples WHERE sample_id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Sample Deleted Successfully"
            });

        }
    );

});

// Home Route
app.get("/", (req, res) => {
    res.send("Laboratory Sample Collection & Report Register API Running...");
});

// START SERVER (REMOVED '127.0.0.1' BINDING)
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
    console.error("Server Error:", err);
});