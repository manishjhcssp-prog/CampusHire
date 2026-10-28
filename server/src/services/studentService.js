const { db } = require('../config/database');

async function getStudentProfile(studentId) {
  const row = await db.get(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            sp.course, sp.graduation_year, sp.cgpa, sp.backlogs_count, sp.branch, sp.skills, sp.resume_url, sp.updated_at
     FROM users u
     LEFT JOIN student_profiles sp ON u.id = sp.student_id
     WHERE u.id = ? AND u.role = 'student'`,
    [studentId]
  );

  if (!row) {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return {
    ...row,
    skills: JSON.parse(row.skills || '[]')
  };
}

async function updateStudentProfile(studentId, data) {
  // Check student user exists
  const user = await db.get("SELECT id FROM users WHERE id = ? AND role = 'student'", [studentId]);
  if (!user) {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  // Get current profile or insert if empty
  const current = await db.get('SELECT * FROM student_profiles WHERE student_id = ?', [studentId]);

  const course = data.course !== undefined ? data.course : (current ? current.course : 'B.Tech');
  const graduation_year = data.graduation_year !== undefined ? parseInt(data.graduation_year, 10) : (current ? current.graduation_year : new Date().getFullYear());
  const cgpa = data.cgpa !== undefined ? parseFloat(data.cgpa) : (current ? current.cgpa : 0.0);
  const backlogs_count = data.backlogs_count !== undefined ? parseInt(data.backlogs_count, 10) : (current ? current.backlogs_count : 0);
  const branch = data.branch !== undefined ? data.branch.toUpperCase().trim() : (current ? current.branch : 'CSE');
  const skills = data.skills !== undefined ? JSON.stringify(data.skills) : (current ? current.skills : '[]');
  const resume_url = data.resume_url !== undefined ? data.resume_url : (current ? current.resume_url : null);

  if (current) {
    await db.run(
      `UPDATE student_profiles
       SET course = ?, graduation_year = ?, cgpa = ?, backlogs_count = ?, branch = ?, skills = ?, resume_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = ?`,
      [course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url, studentId]
    );
  } else {
    await db.run(
      `INSERT INTO student_profiles (student_id, course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url]
    );
  }

  return getStudentProfile(studentId);
}

async function listStudents(filters = {}) {
  let sql = `
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           sp.course, sp.graduation_year, sp.cgpa, sp.backlogs_count, sp.branch, sp.skills, sp.resume_url, sp.updated_at
    FROM users u
    JOIN student_profiles sp ON u.id = sp.student_id
    WHERE u.role = 'student'
  `;
  const params = [];

  if (filters.branch) {
    sql += ' AND sp.branch = ?';
    params.push(filters.branch.toUpperCase().trim());
  }

  if (filters.min_cgpa) {
    sql += ' AND sp.cgpa >= ?';
    params.push(parseFloat(filters.min_cgpa));
  }

  if (filters.max_backlogs !== undefined) {
    sql += ' AND sp.backlogs_count <= ?';
    params.push(parseInt(filters.max_backlogs, 10));
  }

  if (filters.search) {
    sql += ' AND (u.name LIKE ? OR u.email LIKE ? OR sp.skills LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY sp.cgpa DESC, u.name ASC';

  const rows = await db.all(sql, params);
  return rows.map(r => ({
    ...r,
    skills: JSON.parse(r.skills || '[]')
  }));
}

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  listStudents
};

