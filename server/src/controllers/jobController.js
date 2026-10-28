const jobService = require('../services/jobService');
const { checkStudentEligibility } = require('../services/eligibilityEngine');

async function listJobs(req, res, next) {
  try {
    const { company_id, search, branch, max_min_cgpa, is_active } = req.query;
    const jobs = await jobService.listJobs({
      company_id,
      search,
      branch,
      max_min_cgpa,
      is_active
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
}

async function getJobById(req, res, next) {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await jobService.getJobById(jobId);
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
}

async function createJob(req, res, next) {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job
    });
  } catch (err) {
    next(err);
  }
}

async function updateJob(req, res, next) {
  try {
    const jobId = parseInt(req.params.id, 10);
    const updated = await jobService.updateJob(jobId, req.body);
    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

async function deleteJob(req, res, next) {
  try {
    const jobId = parseInt(req.params.id, 10);
    const result = await jobService.deleteJob(jobId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Automated Eligibility Checker Endpoint:
 * Handles:
 *   POST /api/jobs/:id/check-eligibility/:student_id
 * and:
 *   POST /api/jobs/:id/check-eligibility (student evaluates themselves)
 */
async function checkEligibility(req, res, next) {
  try {
    const jobId = parseInt(req.params.id, 10);
    let studentId = req.params.student_id ? parseInt(req.params.student_id, 10) : req.user.id;

    // If user is a student, enforce that they can only check eligibility for themselves
    if (req.user.role === 'student' && studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Students can only evaluate eligibility for their own profile.'
      });
    }

    const result = await checkStudentEligibility(jobId, studentId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function listCompanies(req, res, next) {
  try {
    const companies = await jobService.listCompanies();
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (err) {
    next(err);
  }
}

async function createCompany(req, res, next) {
  try {
    const company = await jobService.createCompany(req.body);
    res.status(201).json({
      success: true,
      message: 'Company registered successfully.',
      data: company
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  checkEligibility,
  listCompanies,
  createCompany
};

