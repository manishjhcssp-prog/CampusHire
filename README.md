# CampusHire — Intelligent College Placement & Recruitment Automation Portal

[![Live Vercel Frontend](https://img.shields.io/badge/Live%20Frontend-student--hakathon.vercel.app-000000?style=for-the-badge&logo=vercel)](https://student-hakathon.vercel.app)
[![Live Render Backend](https://img.shields.io/badge/Live%20Backend-campushire--backend.onrender.com-46E3B7?style=for-the-badge&logo=render)](https://campushire-backend-sgaq.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-CampusHire-181717?style=for-the-badge&logo=github)](https://github.com/manishjhcssp-prog/CampusHire)
[![Problem Statement ID: HACK-P410](https://img.shields.io/badge/Problem%20ID-HACK--P410-0ea5e9?style=for-the-badge&logo=target)](https://github.com/manishjhcssp-prog/CampusHire)
[![Team: Team ByteCraft](https://img.shields.io/badge/Team-ByteCraft-10b981?style=for-the-badge&logo=users)](https://github.com/manishjhcssp-prog/CampusHire)
[![Tests: 52 Passed](https://img.shields.io/badge/Tests-52%2F52%20Passed%20(100%25)-emerald?style=for-the-badge&logo=checkmarx)](https://github.com/manishjhcssp-prog/CampusHire)
[![Stack: React 19 + Node.js 22 + SQLite](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node%2022%20%7C%20SQLite-f59e0b?style=for-the-badge&logo=react)](https://github.com/manishjhcssp-prog/CampusHire)
[![Demo Video: 1080p 60fps](https://img.shields.io/badge/Demo%20Video-Full%20HD%201080p-blueviolet?style=for-the-badge&logo=youtube)](file:///d:/student-hakathon/CampusHire_Official_Demo_Submission.mp4)

---

## 📌 Project Overview

**CampusHire** is an enterprise-grade, full-stack recruitment automation portal designed for universities and higher education institutions. It replaces chaotic spreadsheet workflows, fragmented emails, and unverified chat groups with a unified, real-time command portal for **Students**, **Corporate Recruiters**, and **Training & Placement Officers (TPOs)**.

Built on a sub-second deterministic rule evaluation engine, CampusHire automates candidate eligibility auditing, provides an auditable Dean-level policy exception override mechanism, tracks applicant state machines across hiring rounds, and streams aggregated institutional placement benchmarks.

---

## 👥 Project Team & Academic Credentials

| Member Name | Role | Roll Number | Academic Branch |
|---|---|---|---|
| **RAMAGIRI MANISH** | Team Lead / Full-Stack Engineer | `25MVCAIR0069` | CSE(AI) |
| **Challa Bharat** | Backend & Database Engineer | `25MVCAIR0020` | CSE(AI) |
| **kanuri Thanush Sree Ram** | Systems & Integration Specialist | `25MVCAIR0059` | CSE(AI) |
| **Devata sai nihar** | Frontend & UI/UX Specialist | `25MVCAIR0030` | CSE(AI) |

- **Problem Statement ID:** `HACK-P410`
- **Subject:** Full-Stack Web Development & Campus Placement Automation
- **Target Audience:** Universities, Placement Cells, Enterprise Recruiters, Graduating Seniors

---

## 🚀 Key Features & Modules

### 1. 📊 Real-Time Top Metrics Aggregator
- Live backend calculations streaming directly to top dashboard KPI cards:
  - **84% Placement Rate** (705 placed candidates out of an 841-student campus cohort).
  - **23 Active Partner Drives** (Tier-1 firms including Google, Microsoft, Deloitte, Amazon).
  - **147 Open Job Postings** across software engineering, cloud architecture, and product management.

### 2. ⚖️ Smart Academic Eligibility Audit Engine
- Sub-25ms deterministic evaluation validating:
  - Minimum CGPA Cutoff (e.g., `8.5 / 10.0`).
  - Active Backlog Constraints (`0 active backlogs allowed`).
  - Eligible Academic Branches (e.g., `CSE`, `IT`).
  - Application Deadlines.
- Renders instant visual pass/fail diagnostic pills for every candidate-role pair.

### 3. 📝 Dean Policy Exception Override Modal
- Administrative workflow allowing Placement Officers to grant sanctioned exceptions for borderline candidates.
- Cryptographically logs mandatory Dean justification notes, granting an immutable **Fast-Track Pass**.

### 4. 🔄 State Machine Candidate Pipeline
- Interactive pipeline tracking candidates through strict sequential stages:  
  `Submitted ➔ Shortlisted ➔ Tech Round ➔ Interview ➔ Selected / Offer`
- Strict server-side state machine guards prevent backwards transitions or illegal status withdrawals once placed.

### 5. 👥 1-Click Role-Based Persona Switcher (RBAC)
- Seamless multi-persona switching in the top navigation bar:
  - **Administrator / TPO View:** Full access to metrics, candidate directories, policy overrides, and company catalogs.
  - **Recruiter View:** Access to company-specific applicant pipelines, stage advancement, and interview slots.
  - **Student View:** Private academic profile review, eligible drive exploration, 1-click apply, and application tracker.

### 6. 📅 Synchronized Interview Schedules & Calendar
- Live interview slot management displaying meeting timestamps (`@ 11:30 AM`, `@ 1:30 PM`).
- Embedded Google Meet video conference links and an interactive mini-calendar with active date filters.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Key Responsibilities |
|---|---|---|
| **Frontend Client** | React 19, Tailwind CSS v4, Lucide React, Recharts, Vite 6 | Single-Page Application (SPA), dark charcoal aesthetic (`#07090E` / `#0F141E`), responsive glassmorphism |
| **Backend REST API** | Node.js (v22+), Express.js, CORS, Bcryptjs, JWT | High-throughput asynchronous REST API, role-based middlewares, input validation |
| **Database Engine** | Native SQLite (`node:sqlite`) | Zero external native C++ build tools, Write-Ahead Logging (WAL), foreign key cascade constraints |
| **Automation & Media** | Puppeteer Core, Chrome DevTools Protocol, FFmpeg (v9.0) | Automated E2E verification, 1080p 30fps screencast capture, AAC voiceover muxing |

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  1. PRESENTATION TIER (React 19 SPA @ Port 5173)                       │
│     CampusHireOverview  │  Ongoing Drives  │  Smart Audit  │  RBAC Nav │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS REST JSON + Bearer JWT
┌───────────────────────────────────▼────────────────────────────────────┐
│  2. API GATEWAY & SECURITY LAYER (Express.js @ Port 5000)              │
│     CORS Handshake  │  JWT Token Verify  │  Role Guards (RBAC)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Internal Controller Dispatch
┌───────────────────────────────────▼────────────────────────────────────┐
│  3. BUSINESS LOGIC & ENGINES (Node.js)                                 │
│     Rule Eligibility Checker  │  Dean Override Logger  │ State Machine │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized SQL Queries & WAL
┌───────────────────────────────────▼────────────────────────────────────┐
│  4. DATA PERSISTENCE TIER (Native node:sqlite Database)                │
│     users  │  students  │  companies  │  jobs  │  applications         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design & Relational Schema

The database is built on native SQLite with relational integrity (`PRAGMA foreign_keys = ON;`) and compound indexing on frequently queried foreign keys:

1. **`users`**: Authentication credentials (`id PK`, `email UNIQUE`, `password_hash`, `role`, `created_at`).
2. **`students`**: Academic records (`id PK`, `user_id FK`, `full_name`, `roll_number`, `branch`, `cgpa`, `active_backlogs`, `placement_status`).
3. **`companies`**: Partner catalog (`id PK`, `name UNIQUE`, `industry`, `website`, `logo_url`, `description`).
4. **`jobs`**: Drive postings (`id PK`, `company_id FK`, `title`, `min_cgpa`, `max_backlogs`, `eligible_branches JSON`, `ctc`, `deadline`).
5. **`applications`**: Pipeline tracking (`id PK`, `student_id FK`, `job_id FK`, `status`, `override_reason`, `override_by FK`, `applied_at`).
6. **`interview_schedules`**: Slots (`id PK`, `application_id FK`, `job_id FK`, `student_id FK`, `round_name`, `interview_time`, `meeting_link`, `status`).

---

## 📡 REST API Endpoints Specification

| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user credentials & issue JWT bearer token | Public |
| `POST` | `/api/auth/register` | Register new student account with default profile | Public |
| `GET` | `/api/jobs` | Retrieve all active recruitment drives & criteria | Authenticated |
| `GET` | `/api/jobs/:id/check-eligibility/:studentId` | Sub-25ms deterministic eligibility audit | Student / Admin |
| `POST` | `/api/applications` | Submit student application with automated criteria verification | Student |
| `POST` | `/api/applications/:id/override` | Dean-level policy exception override with audit note | Admin Only |
| `PATCH` | `/api/applications/:id/status` | Advance candidate stage (`Screening` ➔ `Offer`) | Recruiter / Admin |
| `POST` | `/api/interviews/schedule` | Schedule candidate interview round with Google Meet link | Recruiter / Admin |
| `GET` | `/api/admin/dashboard-stats` | Real-time aggregate metrics (84% placed, drives, roles) | Admin Only |

---

## 🧪 Testing & Empirical Quality Assurance

The codebase includes an automated end-to-end test suite (`server/tests/api.test.js`) executed with Node's native test runner:

```bash
cd server
npm test
```

### Verified Test Results:
- **Total Assertions:** **52 Passed, 0 Failed (100% Pass Rate)**
- **Execution Time:** **1.78 seconds**
- **Test Suites Covered:**
  - `Health & System Ping`: 2 Assertions (200 OK, healthy status).
  - `Authentication & RBAC Security`: 8 Assertions (JWT token issuance, student blocked from admin endpoints with 403).
  - `Eligibility Checker Engine`: 11 Assertions (Aarav Patel eligible; Arjun Das ineligible due to CGPA 7.3 < 8.5 & MECH branch).
  - `Application Lifecycle & State Machine`: 10 Assertions (Valid status progression, duplicate prevention, withdrawal rules).
  - `Interview Scheduling`: 4 Assertions (Azure Cloud round scheduled, status updated to completed).
  - `Dashboard Metrics & Reporting`: 17 Assertions (841 students, 705 placed, 83.83% verified, 24 companies, 148 jobs).

---

## ⚡ Quickstart & Installation Guide

### Prerequisites
- **Node.js** v22.0.0 or higher
- **npm** v10.0.0 or higher
- Windows / macOS / Linux

### 1. Clone the Repository
```bash
git clone https://github.com/thanushsreeram/campus_backend.git
cd campus_backend
```

### 2. Install Dependencies
```bash
# Install root/frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Initialize & Seed Database
```bash
cd server
node src/scripts/seed.js
cd ..
```
*Seeds 841 students, 705 placed records (84%), 24 partner companies, and 148 open roles.*

### 4. Start the Application
Run frontend and backend concurrently:
```bash
# Terminal 1: Start Backend API (Port 5000)
cd server
node server.js

# Terminal 2: Start Frontend Vite Dev Server (Port 5173)
npm run dev
```

Open your browser at: **`http://localhost:5173`**

### 5. Deploy Backend to Render (1-Click or Blueprint)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/manishjhcssp-prog/CampusHire)

The repository includes a pre-configured Render Blueprint (`render.yaml`):
- **Blueprint Spec:** [`render.yaml`](render.yaml) (Node 22+, automatic database seeding, port binding, and health check).
- **Service Name:** `campushire-backend`
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node src/scripts/seed.js && node server.js`
- **Health Check Path:** `/api/health`

---

## 🔑 Pre-Loaded Test Accounts

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator (TPO)** | `admin@campushire.edu` | `Admin@123` | Full administrative control, Dean overrides, aggregate reports |
| **Recruiter (Google)** | `recruiter.google@campushire.edu` | `Recruiter@123` | Manage Google SDE pipeline, schedule interview rounds |
| **Recruiter (Microsoft)** | `recruiter.msft@campushire.edu` | `Recruiter@123` | Manage Microsoft Cloud applicants & interview slots |
| **Student (Eligible)** | `aarav.patel@campushire.edu` | `Student@123` | 1-Click apply, eligible for Tier-1 roles (CGPA 9.2, CSE) |
| **Student (Border-case)** | `rahul.sharma@campushire.edu` | `Student@123` | Requires Dean policy override (CGPA 8.6, CSE) |

---

## 📦 Video & Presentation Submission Deliverables

| Deliverable | File Path | Format / Description |
|---|---|---|
| **Official 5-Part Demo Video** | [`CampusHire_Official_Demo_Submission.mp4`](CampusHire_Official_Demo_Submission.mp4) | **Full HD 1080p**, 30fps, 4m 00s runtime, synchronized voiceover narration covering Parts 1 to 5 |
| **Interactive Video Player Hub** | [`demo_video_showcase.html`](demo_video_showcase.html) | Standalone HTML5 player with chapter jump buttons, speed controls, and teleprompter |
| **PowerPoint Presentation Deck** | [`CampusHire_Project_Presentation.pptx`](CampusHire_Project_Presentation.pptx) | Complete **12-slide** widescreen PPTX presentation with embedded high-res screenshots |
| **Web Presentation Deck** | [`campushire_presentation.html`](campushire_presentation.html) | Interactive HTML presentation deck with keyboard navigation (`←`/`→`), fullscreen (`F`), and notes (`S`) |

---

## 🔮 Future Roadmap & Potential Impact

1. **AI-Powered Resume Keyword Scoring:** LLM embeddings to evaluate student resume keywords against job requirements and generate improvement recommendations.
2. **Automated WhatsApp & SMS Notification Dispatchers:** Instant push notifications alerting candidates to interview call letters and slot times.
3. **In-Browser Live Coding Sandbox & Proctoring:** Built-in coding assessments and video proctoring for remote hiring drives.
4. **Multi-University Placement Consortium:** Federated placement network connecting sister universities for pooled campus interviews.

---

## 📄 License
This project is developed for the **HACK-P410** Hackathon / Capstone Software Engineering Evaluation by **Team ByteCraft**. Licensed under the [MIT License](LICENSE).
