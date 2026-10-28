const { db } = require('../config/database');
const { checkStudentEligibility } = require('./eligibilityEngine');

const VALID_STATUSES = ['submitted', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'];

const ALLOWED_TRANSITIONS = {
  submitted: ['shortlisted', 'rejected', 'withdrawn'],
  shortlisted: ['interview', 'rejected', 'withdrawn'],
  interview: ['selected', 'rejected', 'withdrawn'],
  selected: [],
  rejected: [],
  withdrawn: []
};

/**
 * Apply for a job posting
 */
async function applyForJob({ studentId, jobId, force = false }) {
  // 1. Verify student exists
  const student = await db.get('SELECT id, name, role FROM users WHERE id = ?', [studentId]);
  if (!student || student.role !== 'student') {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify duplicate application
  const existingApp = await db.get(
    'SELECT * FROM applications WHERE student_id = ? AND job_id = ?',
    [studentId, jobId]
  );

  if (existingApp) {
    const error = new Error(`Student has already submitted an application for job ID ${jobId} (Current status: '${existingApp.status}').`);
    error.statusCode = 409;
    throw error;
  }

  // 3. Automated Eligibility Check
  const eligibility = await checkStudentEligibility(jobId, studentId);
  if (!eligibility.is_eligible && !force) {
    const error = new Error(`Application rejected: Student does not meet the eligibility requirements.`);
    error.statusCode = 400;
    error.eligibilityAudit = eligibility;
    throw error;
  }

  // 4. Create Application
  const insertResult = await db.run(
    'INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)',
    [studentId, jobId, 'submitted']
  );

  return getApplicationById(insertResult.lastID);
}

/**
 * Get application by ID with full details
 */
async function getApplicationById(applicationId) {
  const row = await db.get(
    `SELECT a.id, a.id as application_id, a.student_id, a.job_id, a.status, a.applied_at, a.updated_at,
            u.name as student_name, u.email as student_email,
            sp.branch as student_branch, sp.cgpa as student_cgpa, sp.backlogs_count as student_backlogs, sp.resume_url,
            j.role_title, j.location, j.package_range, j.deadline,
            c.name as company_name, c.id as company_id
     FROM applications a
     JOIN users u ON a.student_id = u.id
     JOIN student_profiles sp ON u.id = sp.student_id
     JOIN jobs j ON a.job_id = j.id
     JOIN companies c ON j.company_id = c.id
     WHERE a.id = ?`,
    [applicationId]
  );

  if (!row) {
    const error = new Error(`Application with ID ${applicationId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return row;
}

/**
 * List applications with filters and role-based scoping
 */
async function listApplications(filters = {}) {
  let sql = `
    SELECT a.id, a.id as application_id, a.student_id, a.job_id, a.status, a.applied_at, a.updated_at,
           u.name as student_name, u.email as student_email,
           sp.branch as student_branch, sp.cgpa as student_cgpa, sp.backlogs_count as student_backlogs, sp.resume_url,
           j.role_title, j.location, j.package_range,
           c.name as company_name, c.id as company_id
    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN student_profiles sp ON u.id = sp.student_id
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.student_id) {
    sql += ' AND a.student_id = ?';
    params.push(filters.student_id);
  }

  if (filters.job_id) {
    sql += ' AND a.job_id = ?';
    params.push(filters.job_id);
  }

  if (filters.company_id) {
    sql += ' AND c.id = ?';
    params.push(filters.company_id);
  }

  if (filters.status) {
    sql += ' AND a.status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY a.updated_at DESC';

  return db.all(sql, params);
}

/**
 * Transition application workflow status
 */
async function updateApplicationStatus({ applicationId, newStatus, userRole, bypassTransitionRules = false }) {
  if (!VALID_STATUSES.includes(newStatus)) {
    const error = new Error(`Invalid status '${newStatus}'. Allowed: ${VALID_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const application = await getApplicationById(applicationId);
  const currentStatus = application.status;

  if (currentStatus === newStatus) {
    return application; // No change
  }

  // Check state machine transitions unless admin bypasses
  if (!bypassTransitionRules && userRole !== 'admin') {
    const validNextSteps = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!validNextSteps.includes(newStatus)) {
      const error = new Error(
        `Invalid workflow transition from '${currentStatus}' to '${newStatus}'. Allowed transitions from '${currentStatus}': [${validNextSteps.join(', ')}]`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  await db.run(
    'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newStatus, applicationId]
  );

  return getApplicationById(applicationId);
}

/**
 * Student withdraws their own application
 */
async function withdrawApplication(applicationId, studentId) {
  const application = await getApplicationById(applicationId);

  if (application.student_id !== studentId) {
    const error = new Error('You can only withdraw your own applications.');
    error.statusCode = 403;
    throw error;
  }

  if (['selected', 'rejected', 'withdrawn'].includes(application.status)) {
    const error = new Error(`Cannot withdraw application in '${application.status}' state.`);
    error.statusCode = 400;
    throw error;
  }

  await db.run(
    'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    ['withdrawn', applicationId]
  );

  return getApplicationById(applicationId);
}

module.exports = {
  applyForJob,
  getApplicationById,
  listApplications,
  updateApplicationStatus,
  withdrawApplication,
  VALID_STATUSES,
  ALLOWED_TRANSITIONS
};

