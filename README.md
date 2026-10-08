# Research Opportunity Portal

A web application where faculty members can post, view, update, and manage research opportunities in one place, replacing scattered emails, WhatsApp groups, and noticeboards.

Built for the Computer Networks assignment: a REST API backend, a MySQL/MariaDB database, and a simple frontend.

**GitHub Repository:** https://github.com/username/research-opportunity-portal

---

## Features

- Full CRUD REST API for research opportunities
- Input validation on the backend (Pydantic) and the frontend (required form fields)
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Simple frontend that talks to the API through `fetch()` (no hard-coded data)
- Create, edit, delete, and view opportunities; change status from Open to Closed

## Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Backend   | Python, FastAPI, Uvicorn                     |
| ORM       | SQLAlchemy with the PyMySQL driver           |
| Database  | MySQL / MariaDB                              |
| Frontend  | HTML, CSS, JavaScript (served by FastAPI)    |
| Testing   | Postman / Bruno collection (included)        |

## Project Structure

```
research-opportunity-portal/
├── backend/
│   ├── app.py               # FastAPI app and route definitions
│   ├── database.py          # Engine, session, and get_db dependency
│   ├── database_model.py    # SQLAlchemy model (table definition)
│   ├── models.py            # Pydantic models (request validation)
│   └── database_schema.sql  # Table creation and sample data
├── frontend/
│   ├── index.html           # List all opportunities
│   ├── create.html          # Create / edit form
│   ├── view.html            # Single opportunity details
│   ├── app.js
│   └── style.css
├── postman/                 # Exported API collection
├── .gitignore
└── README.md
```

## Setup and Installation

### Prerequisites

- Python 3.10+
- MySQL or MariaDB running locally

### 1. Clone the repository

```bash
git clone https://github.com/username/research-opportunity-portal.git
cd research-opportunity-portal
```

### 2. Create a virtual environment and install dependencies

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pymysql python-dotenv
```

### 3. Set up the database

Create the database and load the schema:

```bash
mysql -u <your_user> -p -e "CREATE DATABASE research_portal;"
mysql -u <your_user> -p research_portal < backend/database_schema.sql
```

Make sure the database user you plan to use has privileges on `research_portal`.

The app also calls `Base.metadata.create_all()` on startup, so the table is created automatically if it does not exist yet.

### 4. Configure environment variables

Create a `.env` file in the `backend/` folder (it is gitignored and must never be committed):

```
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=research_portal
```

### 5. Run the application

From the project root:

```bash
uvicorn backend.app:app --reload
```

- Web app: http://127.0.0.1:8000/
- Interactive API docs (Swagger UI): http://127.0.0.1:8000/docs

The frontend is served by the same FastAPI app, so no separate frontend server is needed.

## Database Schema

Single table: `research_opportunities`

| Column                 | Type                  | Notes                      |
|------------------------|-----------------------|----------------------------|
| `id`                   | INT, PK, AUTO_INCREMENT | Unique ID                |
| `research_title`       | VARCHAR(255)          |                            |
| `research_description` | TEXT                  |                            |
| `research_area`        | VARCHAR(255)          |                            |
| `faculty_name`         | VARCHAR(255)          |                            |
| `department`           | VARCHAR(255)          |                            |
| `required_skills`      | VARCHAR(255)          | Comma-separated list       |
| `available_positions`  | INT                   |                            |
| `application_deadline` | DATE                  | Format: `YYYY-MM-DD`       |
| `status`               | ENUM('Open','Closed') | Defaults to `Open`         |

## API Endpoints

Base path: `/api/opportunities`

| Method | Endpoint                  | Description                     | Success |
|--------|---------------------------|---------------------------------|---------|
| POST   | `/api/opportunities`      | Create a research opportunity   | 201     |
| GET    | `/api/opportunities`      | Retrieve all opportunities      | 200     |
| GET    | `/api/opportunities/{id}` | Retrieve one opportunity by ID  | 200     |
| PUT    | `/api/opportunities/{id}` | Update an existing opportunity  | 200     |
| DELETE | `/api/opportunities/{id}` | Delete an opportunity           | 200     |

### Example request body (POST / PUT)

```json
{
  "research_title": "Machine Learning for Network Intrusion Detection",
  "research_description": "Exploring ML models to detect anomalous network traffic in real time.",
  "research_area": "Cybersecurity",
  "faculty_name": "Dr. Ahmed Khan",
  "department": "Computer Science",
  "required_skills": "Python, Machine Learning, Networking",
  "available_positions": 2,
  "application_deadline": "2026-11-15",
  "status": "Open"
}
```

`status` must be exactly `Open` or `Closed`.

### Example response

```json
{
  "id": 1,
  "research_title": "Machine Learning for Network Intrusion Detection",
  "research_description": "Exploring ML models to detect anomalous network traffic in real time.",
  "research_area": "Cybersecurity",
  "faculty_name": "Dr. Ahmed Khan",
  "department": "Computer Science",
  "required_skills": "Python, Machine Learning, Networking",
  "available_positions": 2,
  "application_deadline": "2026-11-15",
  "status": "Open"
}
```

### Status codes

| Code | Meaning                                              |
|------|------------------------------------------------------|
| 200  | OK, request succeeded                                |
| 201  | Created, new opportunity stored                      |
| 400  | Bad Request, invalid or missing input data           |
| 404  | Not Found, no opportunity with the given ID          |
| 500  | Internal Server Error, unexpected failure            |

## Frontend

| Page          | Purpose                                                              |
|---------------|----------------------------------------------------------------------|
| `index.html`  | Lists all opportunities, with Edit and Delete actions                |
| `create.html` | Form to create a new opportunity (also used for editing via `?id=`)  |
| `view.html`   | Full details of a single opportunity                                 |

All data is loaded from the REST API at runtime; nothing is hard-coded in the frontend.

## API Testing

A Postman collection is included in the `postman/` folder. Import it into Postman or Bruno and run the requests against `http://127.0.0.1:8000`. The collection covers:

1. Creating at least three research opportunities
2. Retrieving all opportunities
3. Retrieving one opportunity by ID
4. Updating an existing opportunity
5. Changing an opportunity's status from Open to Closed
6. Deleting an opportunity
7. Requesting the deleted opportunity again (404 Not Found)
8. Sending a request with invalid or missing data (input validation)

## Security Notes

- Database credentials are loaded from a `.env` file, which is excluded from version control via `.gitignore`.
- Never commit passwords, API keys, or other credentials to the repository.

## Author

Muhammad Israr, BS Computer Science, FAST National University (Peshawar Campus)