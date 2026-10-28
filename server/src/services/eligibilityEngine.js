const { db } = require('../config/database');

/**
 * Evaluates whether a student meets the eligibility criteria for a specific job posting.
 * Provides a detailed audit breakdown explaining the verdict for each requirement.
 * 
 * @param {number} jobId 
 * @param {number} studentId 
 * @returns {Promise<Object>} Detailed eligibility evaluation result
 */
async function checkStudentEligibility(jobId, studentId) {
  // 1. Fetch Job and Company Details
  const job = await db.get(
    `SELECT j.*, c.name as company_name 
     FROM jobs j 
     JOIN companies c ON j.company_id = c.id 
     WHERE j.id = ?`,
    [jobId]
  );

  if (!job) {
    const error = new Error(`Job posting with ID ${jobId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch Student User & Profile
  const student = await db.get(
    `SELECT u.id, u.name, u.email, u.role, 
            sp.course, sp.graduation_year, sp.cgpa, sp.backlogs_count, sp.branch, sp.skills, sp.resume_url
     FROM users u
     LEFT JOIN student_profiles sp ON u.id = sp.student_id
     WHERE u.id = ? AND u.role = 'student'`,
    [studentId]
  );

  if (!student) {
    const error = new Error(`Student with ID ${studentId} not found or is not a registered student.`);
    error.statusCode = 404;
    throw error;
  }

  if (student.cgpa === null || student.branch === null) {
    const error = new Error(`Student profile for ID ${studentId} is incomplete (missing CGPA or branch).`);
    error.statusCode = 400;
    throw error;
  }

  // Parse allowed branches (stored as JSON array string)
  let allowedBranches = [];
  try {
    allowedBranches = JSON.parse(job.allowed_branches || '["ALL"]');
  } catch (e) {
    allowedBranches = [job.allowed_branches];
  }
  const normalizedAllowed = allowedBranches.map(b => String(b).toUpperCase().trim());
  const allowsAllBranches = normalizedAllowed.includes('ALL') || normalizedAllowed.includes('*');

  // Parse student values
  const studentCgpa = parseFloat(student.cgpa);
  const requiredMinCgpa = parseFloat(job.min_cgpa);
  const studentBacklogs = parseInt(student.backlogs_count, 10);
  const maxAllowedBacklogs = parseInt(job.max_backlogs, 10);
  const studentBranch = String(student.branch).toUpperCase().trim();

  // Evaluate CGPA
  const cgpaPassed = studentCgpa >= requiredMinCgpa;
  const cgpaAudit = {
    student_value: studentCgpa,
    required_minimum: requiredMinCgpa,
    passed: cgpaPassed,
    reason: cgpaPassed
      ? `Student CGPA (${studentCgpa.toFixed(2)}) meets or exceeds the required minimum (${requiredMinCgpa.toFixed(2)}).`
      : `Student CGPA (${studentCgpa.toFixed(2)}) is below the required minimum (${requiredMinCgpa.toFixed(2)}).`
  };

  // Evaluate Branch
  const branchPassed = allowsAllBranches || normalizedAllowed.includes(studentBranch);
  const branchAudit = {
    student_value: studentBranch,
    allowed_branches: allowsAllBranches ? ['ALL_BRANCHES'] : normalizedAllowed,
    passed: branchPassed,
    reason: branchPassed
      ? `Student branch '${studentBranch}' is eligible for this role.`
      : `Student branch '${studentBranch}' is not in the allowed list: [${normalizedAllowed.join(', ')}].`
  };

  // Evaluate Backlogs
  const backlogsPassed = studentBacklogs <= maxAllowedBacklogs;
  const backlogsAudit = {
    student_value: studentBacklogs,
    max_allowed: maxAllowedBacklogs,
    passed: backlogsPassed,
    reason: backlogsPassed
      ? `Student has ${studentBacklogs} backlog(s), which does not exceed the limit of ${maxAllowedBacklogs}.`
      : `Student has ${studentBacklogs} backlog(s), which exceeds the maximum allowed limit of ${maxAllowedBacklogs}.`
  };

  // Evaluate Application Deadline
  const deadlineDate = new Date(job.deadline);
  const now = new Date();
  const deadlinePassed = now <= deadlineDate;
  const deadlineAudit = {
    job_deadline: job.deadline,
    is_expired: !deadlinePassed,
    passed: deadlinePassed,
    reason: deadlinePassed
      ? `Application window is open (deadline: ${job.deadline}).`
      : `Application window closed on ${job.deadline}.`
  };

  // Active Job Check
  const isActive = Boolean(job.is_active);

  // Overall eligibility result
  const passedCriteria = [];
  const failedCriteria = [];

  if (cgpaPassed) passedCriteria.push('CGPA');
  else failedCriteria.push('CGPA');

  if (branchPassed) passedCriteria.push('Branch');
  else failedCriteria.push('Branch');

  if (backlogsPassed) passedCriteria.push('Backlogs');
  else failedCriteria.push('Backlogs');

  if (!deadlinePassed) failedCriteria.push('Application Deadline Expired');
  if (!isActive) failedCriteria.push('Job Inactive');

  const isEligible = cgpaPassed && branchPassed && backlogsPassed && deadlinePassed && isActive;

  let summary = '';
  if (isEligible) {
    summary = `Student is fully eligible to apply for '${job.role_title}' at ${job.company_name}.`;
  } else {
    summary = `Student is not eligible due to failed criteria: ${failedCriteria.join(', ')}.`;
  }

  return {
    is_eligible: isEligible,
    job: {
      id: job.id,
      company_name: job.company_name,
      role_title: job.role_title,
      package_range: job.package_range,
      location: job.location,
      deadline: job.deadline,
      is_active: isActive
    },
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      branch: studentBranch,
      cgpa: studentCgpa,
      backlogs_count: studentBacklogs,
      course: student.course,
      graduation_year: student.graduation_year
    },
    audit_breakdown: {
      cgpa: cgpaAudit,
      branch: branchAudit,
      backlogs: backlogsAudit,
      deadline: deadlineAudit
    },
    passed_criteria: passedCriteria,
    failed_criteria: failedCriteria,
    summary
  };
}

module.exports = {
  checkStudentEligibility
};

