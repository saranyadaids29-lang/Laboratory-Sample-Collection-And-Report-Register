# Laboratory Sample Collection & Report Register

## Problem Statement

Laboratories often maintain sample collection and report records manually, making it difficult to track sample status and pending reports.

This application digitizes the process by storing laboratory sample details, tracking sample status, and managing report generation efficiently.

## Features

- Add sample records
- View all samples
- Update sample details
- Delete sample records
- Search by Sample ID, Patient Name, or Test Type
- Filter by Status
- Dashboard with sample statistics
- Automatic Pending Days calculation
- Responsive design
- SQLite database integration

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite3
- CORS

## How to Run

1. Clone the repository.

```bash
git clone https://github.com/your-username/laboratory-sample-collection-report-register.git
```

2. Open the project folder.

```bash
cd laboratory-sample-collection-report-register
```

3. Install dependencies.

```bash
npm install
```

4. Start the server.

```bash
node server.js
```

5. Open your browser and visit:

```
http://127.0.0.1:3000
```

## Field Description

| Field | Description |
|--------|-------------|
| Sample ID | Unique identifier for each sample |
| Patient Name | Name of the patient |
| Test Type | Type of laboratory test |
| Collected Date | Date when the sample was collected |
| Status | Current stage of the sample |
| Processed Date | Date when the sample was processed |
| Report Issued Date | Date when the report was issued |
| Collected By | Name of the laboratory staff member |

## Derived Value

**Pending Days** is calculated using:

```
Pending Days = Current Date - Collected Date
```

If the status is **Report Ready** or **Delivered**, the Pending Days value is **0**.

## Project Structure

```
database/
│── lab.db

public/
│── index.html
│── style.css
│── script.js

server.js
package.json
README.md
```

## Current Limitations

- User authentication is not implemented.
- PDF report generation is not available.
- Email notifications are not implemented.
- Barcode/QR code support is not available.
- Export to Excel/PDF is not implemented.


## Demo Video

https://drive.google.com/file/d/1_pWYfYb8XrPx_6B1rD4DFkVp1S3sXhzG/view?usp=sharing

## Developed By

**D. Saranya**

B.Tech Artificial Intelligence and Data Science

Prince Group of Institutions

## License

Developed for educational purposes as part of the Smart India Hackathon (SIH) 2026 Skill Assessment.
