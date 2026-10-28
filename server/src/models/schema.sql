-- CampusHire Database Schema (SQLite / Relational SQL)

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'recruiter', 'student')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  student_id INTEGER PRIMARY KEY,
  course TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  cgpa REAL NOT NULL CHECK(cgpa >= 0.0 AND cgpa <= 10.0),
  backlogs_count INTEGER NOT NULL DEFAULT 0 CHECK(backlogs_count >= 0),
  branch TEXT NOT NULL,
  skills TEXT DEFAULT '[]', -- JSON array of strings
  resume_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  industry TEXT,
  website TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Job Postings Table
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  role_title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  package_range TEXT NOT NULL,
  deadline DATETIME NOT NULL,
  min_cgpa REAL NOT NULL DEFAULT 0.0 CHECK(min_cgpa >= 0.0 AND min_cgpa <= 10.0),
  allowed_branches TEXT NOT NULL DEFAULT '["ALL"]', -- JSON array of branch codes
  max_backlogs INTEGER NOT NULL DEFAULT 0 CHECK(max_backlogs >= 0),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn')),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, job_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 6. Interview Schedules Table
CREATE TABLE IF NOT EXISTS interview_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  interviewer_name TEXT NOT NULL,
  interview_time DATETIME NOT NULL,
  round_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_branch ON student_profiles(branch);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON student_profiles(cgpa);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_interviews_student ON interview_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job ON interview_schedules(job_id);

