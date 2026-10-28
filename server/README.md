# CampusHire - College Placement Management Portal Backend API

A production-ready RESTful backend API for a College Placement Management Portal ("CampusHire") built with **Node.js**, **Express**, and a relational database engine (**SQLite** / **SQL**), supporting end-to-end recruitment workflows, an automated eligibility checker engine, role-based access control (RBAC), and analytics dashboards.

---

## 🌟 Key Features

1. **Authentication & Role-Based Access Control (RBAC)**:
   - Secure password hashing using `bcryptjs` (salt rounds: 10).
   - Stateless JWT authentication with role authorization (`admin`, `recruiter`, `student`).
   - Granular permissions: students can only access/modify their own profile and applications.
2. **Automated Eligibility Checker Engine**:
   - `POST /api/jobs/:id/check-eligibility/:student_id` (and `/check-eligibility` for self-check).
   - Deep inspection of **Minimum CGPA**, **Allowed Branches**, **Max Backlogs**, and **Application Deadline**.
   - Generates an explicit audit breakdown explaining reasons for qualification or rejection.
   - Enforced automatically at the application endpoint (`POST /api/applications`).
3. **Application Lifecycle & Workflow State Machine**:
   - Manages transitions: `submitted` ➔ `shortlisted` ➔ `interview` ➔ `selected` / `rejected`.
   - Prevents duplicate applications and enforces allowed transition paths.
   - Self-service withdrawal support for applicants.
4. **Interview Scheduling**:
   - Coordinate technical, coding, and HR rounds.
   - Integrated with application state (automatically promotes candidate to interview stage).
5. **Dashboard & Reporting Analytics**:
   - `GET /api/admin/dashboard-stats`: Real-time placement metrics, active placement drives, open roles count, application volume breakdown by status, and branch-wise placement percentages.
6. **Synthetic Seeding Script**:
   - Pre-loads 4 companies, 5 job postings, and 20 synthetic student profiles with varied CGPAs, branches, and backlogs.

---

## 📁 Project Architecture

```
campus_Hire/
├── .env                       # Environment configuration
├── .env.example               # Template environment variables
├── package.json               # Dependencies and scripts
├── server.js                  # Entry point with database migration
├── README.md                  # Comprehensive API documentation
├── data/                      # Relational SQLite database storage
│   └── campushire.sqlite
├── src/
│   ├── app.js                 # Express application & route mounts
│   ├── config/
│   │   └── database.js        # Relational SQL connection & helpers
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── jobController.js
│   │   └── studentController.js
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification & RBAC guards
│   │   └── errorHandler.js    # Standardized error responses
│   ├── models/
│   │   └── schema.sql         # Relational schema (DDL & indexes)
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── index.js
│   │   ├── interviewRoutes.js
│   │   ├── jobRoutes.js
│   │   └── studentRoutes.js
│   ├── scripts/
│   │   └── seed.js            # Database seeding script
│   └── services/
│       ├── analyticsService.js
│       ├── applicationService.js
│       ├── authService.js
│       ├── eligibilityEngine.js
│       ├── interviewService.js
│       ├── jobService.js
│       └── studentService.js
└── tests/
    └── api.test.js            # End-to-end integration test suite
```

---

## 🚀 Quickstart & Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create or edit `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secure_campushire_jwt_secret_key_2026_xyz!
JWT_EXPIRES_IN=24h
DB_PATH=./data/campushire.sqlite
```

### 3. Seed Database
Pre-load companies, job postings, and 20 synthetic students:
```bash
npm run seed
```

### 4. Run the API Server
```bash
# Production start
npm start

# Development mode with hot-reloading
npm run dev
```
The server will boot on `http://localhost:5000`.

### 5. Run Test Suite
```bash
npm test
```

---

## 👥 Seeded Test Credentials

All accounts come pre-configured in the database:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **admin** | `admin@campushire.edu` | `Admin@123` | Full access to portal & analytics |
| **recruiter** | `recruiter.google@campushire.edu` | `Recruiter@123` | Google Talent Lead |
| **recruiter** | `recruiter.msft@campushire.edu` | `Recruiter@123` | Microsoft Campus Recruiter |
| **recruiter** | `recruiter.amazon@campushire.edu` | `Recruiter@123` | Amazon Recruiter |
| **student #1** | `aarav.patel@campushire.edu` | `Student@123` | CSE, CGPA 9.60, 0 Backlogs (Eligible for all) |
| **student #2** | `diya.sen@campushire.edu` | `Student@123` | CSE, CGPA 9.10, 0 Backlogs |
| **student #10** | `arjun.das@campushire.edu` | `Student@123` | MECH, CGPA 7.30, 0 Backlogs |
| **student #15** | `bhavna.chauhan@campushire.edu` | `Student@123` | CSE, CGPA 6.40, 2 Backlogs |
| **student #20** | `siddharth.rao@campushire.edu` | `Student@123` | CSE, CGPA 8.90, 0 Backlogs |

---

## 📡 API Reference

### 1. Authentication (`/api/auth`)

#### Register User
`POST /api/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@campushire.edu",
  "password": "Password@123",
  "role": "student",
  "profile": {
    "branch": "CSE",
    "cgpa": 8.8,
    "backlogs_count": 0,
    "course": "B.Tech",
    "graduation_year": 2026,
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

#### Login User
`POST /api/auth/login`
```json
{
  "email": "aarav.patel@campushire.edu",
  "password": "Student@123"
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 5,
      "name": "Aarav Patel",
      "email": "aarav.patel@campushire.edu",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

### 2. Automated Eligibility Checker Engine (`/api/jobs`)

#### Check Eligibility for a Student
`POST /api/jobs/:id/check-eligibility/:student_id`
*(Header: `Authorization: Bearer <token>`)*

**Sample Response (Eligible Candidate)**:
```json
{
  "success": true,
  "data": {
    "is_eligible": true,
    "job": {
      "id": 1,
      "company_name": "Google LLC",
      "role_title": "Software Development Engineer I (SDE-1)",
      "package_range": "₹28 - ₹36 LPA",
      "deadline": "2026-11-27T04:46:17.000Z"
    },
    "student": {
      "id": 5,
      "name": "Aarav Patel",
      "branch": "CSE",
      "cgpa": 9.6,
      "backlogs_count": 0
    },
    "audit_breakdown": {
      "cgpa": {
        "student_value": 9.6,
        "required_minimum": 8.5,
        "passed": true,
        "reason": "Student CGPA (9.60) meets or exceeds the required minimum (8.50)."
      },
      "branch": {
        "student_value": "CSE",
        "allowed_branches": ["CSE", "IT"],
        "passed": true,
        "reason": "Student branch 'CSE' is eligible for this role."
      },
      "backlogs": {
        "student_value": 0,
        "max_allowed": 0,
        "passed": true,
        "reason": "Student has 0 backlog(s), which does not exceed the limit of 0."
      },
      "deadline": {
        "job_deadline": "2026-11-27T04:46:17.000Z",
        "is_expired": false,
        "passed": true,
        "reason": "Application window is open."
      }
    },
    "passed_criteria": ["CGPA", "Branch", "Backlogs"],
    "failed_criteria": [],
    "summary": "Student is fully eligible to apply for 'Software Development Engineer I (SDE-1)' at Google LLC."
  }
}
```

**Sample Response (Ineligible Candidate - e.g., Arjun Das / MECH student)**:
```json
{
  "success": true,
  "data": {
    "is_eligible": false,
    "audit_breakdown": {
      "cgpa": {
        "student_value": 7.3,
        "required_minimum": 8.5,
        "passed": false,
        "reason": "Student CGPA (7.30) is below the required minimum (8.50)."
      },
      "branch": {
        "student_value": "MECH",
        "allowed_branches": ["CSE", "IT"],
        "passed": false,
        "reason": "Student branch 'MECH' is not in the allowed list: [CSE, IT]."
      },
      "backlogs": {
        "student_value": 0,
        "max_allowed": 0,
        "passed": true,
        "reason": "Student has 0 backlog(s), which does not exceed the limit of 0."
      }
    },
    "passed_criteria": ["Backlogs"],
    "failed_criteria": ["CGPA", "Branch"],
    "summary": "Student is not eligible due to failed criteria: CGPA, Branch."
  }
}
```

---

### 3. Application Lifecycle Management (`/api/applications`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications` | `student`, `admin` | Applies for job. Automatically triggers eligibility engine. |
| `GET` | `/api/applications` | All (scoped) | List applications (students see theirs; recruiters/admins see all). |
| `GET` | `/api/applications/:id` | `student` (self), `recruiter`, `admin` | Get application details. |
| `PATCH` | `/api/applications/:id/status` | `recruiter`, `admin` | Transition status (`shortlisted`, `interview`, `selected`, `rejected`). |
| `POST` | `/api/applications/:id/withdraw` | `student` (self) | Student withdraws application. |

#### Applying for a Job
`POST /api/applications`
```json
{
  "job_id": 1
}
```

#### Updating Application Workflow Status
`PATCH /api/applications/:id/status`
```json
{
  "status": "shortlisted"
}
```

---

### 4. Interview Schedules (`/api/interviews`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interviews` | `recruiter`, `admin` | Schedule interview round. Promotes app status to `interview`. |
| `GET` | `/api/interviews` | All (scoped) | List scheduled interviews. |
| `GET` | `/api/interviews/:id` | All (scoped) | Get interview details. |
| `PATCH` | `/api/interviews/:id` | `recruiter`, `admin` | Update round status (`completed`, `cancelled`) or notes. |

#### Scheduling an Interview Round
`POST /api/interviews`
```json
{
  "job_id": 1,
  "student_id": 5,
  "interviewer_name": "Dr. Alan Turing (Google Eng Lead)",
  "interview_time": "2026-11-02T10:00:00Z",
  "round_name": "Data Structures & Algorithms Round",
  "notes": "Focus on graphs, dynamic programming, and concurrency."
}
```

---

### 5. Admin Dashboard & Analytics (`/api/admin/dashboard-stats`)

`GET /api/admin/dashboard-stats` *(Admin role required)*

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "total_students": 20,
      "placed_students": 2,
      "unplaced_students": 18,
      "placement_percentage": 10.0,
      "active_drives_count": 4,
      "open_roles_count": 4,
      "total_jobs_count": 5,
      "total_companies_count": 4,
      "upcoming_interviews_count": 3
    },
    "application_volume": {
      "total": 14,
      "submitted": 3,
      "shortlisted": 4,
      "interview": 2,
      "selected": 2,
      "rejected": 1,
      "withdrawn": 2
    },
    "branch_breakdown": [
      { "branch": "CIVIL", "total_students": 2, "placed_students": 0, "placement_rate": 0.0 },
      { "branch": "CSE", "total_students": 7, "placed_students": 1, "placement_rate": 14.29 },
      { "branch": "ECE", "total_students": 3, "placed_students": 1, "placement_rate": 33.33 },
      { "branch": "EEE", "total_students": 3, "placed_students": 0, "placement_rate": 0.0 },
      { "branch": "IT", "total_students": 3, "placed_students": 0, "placement_rate": 0.0 },
      { "branch": "MECH", "total_students": 2, "placed_students": 0, "placement_rate": 0.0 }
    ],
    "timestamp": "2026-10-28T04:47:00.000Z"
  }
}
```

---

## 🔒 Security Best Practices

- **Zero Plaintext Passwords**: Passwords hashed with `bcryptjs` salt rounds 10.
- **SQL Injection Defense**: All database queries use parameterized SQL prepared statements.
- **Foreign Key Constraints**: SQLite foreign key checks enabled on every connection (`PRAGMA foreign_keys = ON;`).
- **Role Isolation**: Strictly enforced middleware guards preventing students from viewing unauthorized candidate profiles or admin statistics.

