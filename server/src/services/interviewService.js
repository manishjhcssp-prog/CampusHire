const { db } = require('../config/database');

async function scheduleInterview({ job_id, student_id, interviewer_name, interview_time, round_name, notes }) {
  if (!job_id || !student_id || !interviewer_name || !interview_time || !round_name) {
    const error = new Error('job_id, student_id, interviewer_name, interview_time, and round_name are required.');
    error.statusCode = 400;
    throw error;
  }

  // Verify job exists
  const job = await db.get('SELECT id, role_title FROM jobs WHERE id = ?', [job_id]);
  if (!job) {
    const error = new Error(`Job with ID ${job_id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  // Verify student exists
  const student = await db.get("SELECT id, name, role FROM users WHERE id = ? AND role = 'student'", [student_id]);
  if (!student) {
    const error = new Error(`Student with ID ${student_id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  // Check if application exists
  const application = await db.get(
    'SELECT id, status FROM applications WHERE student_id = ? AND job_id = ?',
    [student_id, job_id]
  );

  if (!application) {
    const error = new Error(`Cannot schedule interview: Student has not applied for this job.`);
    error.statusCode = 400;
    throw error;
  }

  if (['rejected', 'withdrawn'].includes(application.status)) {
    const error = new Error(`Cannot schedule interview for application with '${application.status}' status.`);
    error.statusCode = 400;
    throw error;
  }

  // Insert interview schedule
  const insertResult = await db.run(
    `INSERT INTO interview_schedules (job_id, student_id, interviewer_name, interview_time, round_name, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
    [job_id, student_id, interviewer_name.trim(), interview_time, round_name.trim(), notes || null]
  );

  // Automatically ensure application workflow moves to 'interview' stage if currently 'submitted' or 'shortlisted'
  if (['submitted', 'shortlisted'].includes(application.status)) {
    await db.run(
      "UPDATE applications SET status = 'interview', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [application.id]
    );
  }

  return getInterviewById(insertResult.lastID);
}

async function getInterviewById(id) {
  const row = await db.get(
    `SELECT i.id, i.id as schedule_id, i.job_id, i.student_id, i.interviewer_name, i.interview_time,
            i.round_name, i.status, i.notes, i.created_at,
            u.name as student_name, u.email as student_email,
            sp.branch as student_branch, sp.cgpa as student_cgpa,
            j.role_title, c.name as company_name
     FROM interview_schedules i
     JOIN users u ON i.student_id = u.id
     LEFT JOIN student_profiles sp ON u.id = sp.student_id
     JOIN jobs j ON i.job_id = j.id
     JOIN companies c ON j.company_id = c.id
     WHERE i.id = ?`,
    [id]
  );

  if (!row) {
    const error = new Error(`Interview schedule with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return row;
}

async function listInterviews(filters = {}) {
  let sql = `
    SELECT i.id, i.id as schedule_id, i.job_id, i.student_id, i.interviewer_name, i.interview_time,
            i.round_name, i.status, i.notes, i.created_at,
            u.name as student_name, u.email as student_email,
            sp.branch as student_branch, sp.cgpa as student_cgpa,
            j.role_title, c.name as company_name
    FROM interview_schedules i
    JOIN users u ON i.student_id = u.id
    LEFT JOIN student_profiles sp ON u.id = sp.student_id
    JOIN jobs j ON i.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.student_id) {
    sql += ' AND i.student_id = ?';
    params.push(filters.student_id);
  }

  if (filters.job_id) {
    sql += ' AND i.job_id = ?';
    params.push(filters.job_id);
  }

  if (filters.status) {
    sql += ' AND i.status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY i.interview_time ASC';

  return db.all(sql, params);
}

async function updateInterview(id, updates) {
  const existing = await getInterviewById(id);

  const interviewer_name = updates.interviewer_name || existing.interviewer_name;
  const interview_time = updates.interview_time || existing.interview_time;
  const round_name = updates.round_name || existing.round_name;
  const status = updates.status || existing.status;
  const notes = updates.notes !== undefined ? updates.notes : existing.notes;

  const validStatuses = ['scheduled', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error(`Invalid interview status '${status}'. Allowed: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  await db.run(
    `UPDATE interview_schedules
     SET interviewer_name = ?, interview_time = ?, round_name = ?, status = ?, notes = ?
     WHERE id = ?`,
    [interviewer_name, interview_time, round_name, status, notes, id]
  );

  return getInterviewById(id);
}

module.exports = {
  scheduleInterview,
  getInterviewById,
  listInterviews,
  updateInterview
};

