# Laboratory Sample Collection & Report Register

A web-based application for managing laboratory sample collection, processing, and report generation. The system allows laboratory staff to add, update, delete, search, and filter sample records while maintaining an organized digital register.

## Features

- Add sample records
- View all samples
- Update sample details
- Delete sample records
- Search by Sample ID, Patient Name, or Test Type
- Filter by Status
- Dashboard with sample statistics
- Pending days calculation
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

## Installation

```bash
git clone https://github.com/your-username/laboratory-sample-collection-report-register.git
cd laboratory-sample-collection-report-register
npm install
node server.js
```

Open your browser and visit:

```
http://127.0.0.1:3000
```

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

## Future Enhancements

- User Authentication
- PDF Report Generation
- Email Notifications
- Barcode/QR Code Support
- Cloud Database
- Excel/PDF Export
- Role-Based Access

## Developed By

**D. Saranya**

B.Tech Artificial Intelligence and Data Science

Prince Group of Institutions

## License

Developed for educational purposes as part of the Smart India Hackathon (SIH) 2026 Skill Assessment.
