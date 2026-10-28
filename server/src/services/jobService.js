const { db } = require('../config/database');

async function createCompany({ name, industry, website, location }) {
  if (!name) {
    const error = new Error('Company name is required.');
    error.statusCode = 400;
    throw error;
  }

  const result = await db.run(
    'INSERT INTO companies (name, industry, website, location) VALUES (?, ?, ?, ?)',
    [name.trim(), industry || null, website || null, location || null]
  );

  return db.get('SELECT * FROM companies WHERE id = ?', [result.lastID]);
}

async function listCompanies() {
  return db.all('SELECT * FROM companies ORDER BY name ASC');
}

async function getCompanyById(id) {
  const company = await db.get('SELECT * FROM companies WHERE id = ?', [id]);
  if (!company) {
    const error = new Error(`Company with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }
  return company;
}

async function createJob({
  company_id,
  role_title,
  description,
  location,
  package_range,
  deadline,
  min_cgpa,
  allowed_branches,
  max_backlogs,
  is_active
}) {
  if (!company_id || !role_title || !location || !package_range || !deadline) {
    const error = new Error('Missing required fields: company_id, role_title, location, package_range, and deadline are required.');
    error.statusCode = 400;
    throw error;
  }

  // Verify company exists
  await getCompanyById(company_id);

  const branchesJson = Array.isArray(allowed_branches)
    ? JSON.stringify(allowed_branches.map(b => b.toUpperCase().trim()))
    : JSON.stringify(['ALL']);

  const minCgpaVal = min_cgpa !== undefined ? parseFloat(min_cgpa) : 0.0;
  const maxBacklogsVal = max_backlogs !== undefined ? parseInt(max_backlogs, 10) : 0;
  const isActiveVal = is_active !== undefined ? (is_active ? 1 : 0) : 1;

  const result = await db.run(
    `INSERT INTO jobs (company_id, role_title, description, location, package_range, deadline, min_cgpa, allowed_branches, max_backlogs, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [company_id, role_title.trim(), description || '', location.trim(), package_range.trim(), deadline, minCgpaVal, branchesJson, maxBacklogsVal, isActiveVal]
  );

  return getJobById(result.lastID);
}

async function listJobs(filters = {}) {
  let sql = `
    SELECT j.*, c.name as company_name, c.website as company_website, c.industry as company_industry
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.is_active !== undefined) {
    sql += ' AND j.is_active = ?';
    params.push(filters.is_active ? 1 : 0);
  }

  if (filters.company_id) {
    sql += ' AND j.company_id = ?';
    params.push(filters.company_id);
  }

  if (filters.search) {
    sql += ' AND (j.role_title LIKE ? OR c.name LIKE ? OR j.location LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  if (filters.branch) {
    const branchUpper = filters.branch.toUpperCase();
    sql += ` AND (j.allowed_branches LIKE '%"ALL"%' OR j.allowed_branches LIKE ?)`;
    params.push(`%"${branchUpper}"%`);
  }

  if (filters.max_min_cgpa) {
    sql += ' AND j.min_cgpa <= ?';
    params.push(parseFloat(filters.max_min_cgpa));
  }

  sql += ' ORDER BY j.created_at DESC';

  const rows = await db.all(sql, params);
  return rows.map(row => ({
    ...row,
    allowed_branches: JSON.parse(row.allowed_branches || '["ALL"]')
  }));
}

async function getJobById(id) {
  const row = await db.get(
    `SELECT j.*, c.name as company_name, c.website as company_website, c.industry as company_industry
     FROM jobs j
     JOIN companies c ON j.company_id = c.id
     WHERE j.id = ?`,
    [id]
  );

  if (!row) {
    const error = new Error(`Job posting with ID ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return {
    ...row,
    allowed_branches: JSON.parse(row.allowed_branches || '["ALL"]')
  };
}

async function updateJob(id, updates) {
  const existing = await getJobById(id);

  const role_title = updates.role_title !== undefined ? updates.role_title : existing.role_title;
  const description = updates.description !== undefined ? updates.description : existing.description;
  const location = updates.location !== undefined ? updates.location : existing.location;
  const package_range = updates.package_range !== undefined ? updates.package_range : existing.package_range;
  const deadline = updates.deadline !== undefined ? updates.deadline : existing.deadline;
  const min_cgpa = updates.min_cgpa !== undefined ? parseFloat(updates.min_cgpa) : existing.min_cgpa;
  const max_backlogs = updates.max_backlogs !== undefined ? parseInt(updates.max_backlogs, 10) : existing.max_backlogs;
  const is_active = updates.is_active !== undefined ? (updates.is_active ? 1 : 0) : existing.is_active;

  let branchesJson = existing.allowed_branches;
  if (updates.allowed_branches !== undefined) {
    branchesJson = Array.isArray(updates.allowed_branches)
      ? JSON.stringify(updates.allowed_branches.map(b => b.toUpperCase().trim()))
      : JSON.stringify(['ALL']);
  } else {
    branchesJson = JSON.stringify(existing.allowed_branches);
  }

  await db.run(
    `UPDATE jobs
     SET role_title = ?, description = ?, location = ?, package_range = ?, deadline = ?,
         min_cgpa = ?, allowed_branches = ?, max_backlogs = ?, is_active = ?
     WHERE id = ?`,
    [role_title, description, location, package_range, deadline, min_cgpa, branchesJson, max_backlogs, is_active, id]
  );

  return getJobById(id);
}

async function deleteJob(id) {
  await getJobById(id);
  await db.run('DELETE FROM jobs WHERE id = ?', [id]);
  return { success: true, message: `Job posting ${id} successfully deleted.` };
}

module.exports = {
  createCompany,
  listCompanies,
  getCompanyById,
  createJob,
  listJobs,
  getJobById,
  updateJob,
  deleteJob
};

