const applicationService = require('../services/applicationService');

async function apply(req, res, next) {
  try {
    const { job_id, student_id, force } = req.body;
    let targetStudentId = student_id;

    // If logged in as student, enforce applying for themselves
    if (req.user.role === 'student') {
      targetStudentId = req.user.id;
    } else if (!targetStudentId) {
      return res.status(400).json({
        success: false,
        error: 'student_id is required when applying on behalf of a student.'
      });
    }

    if (!job_id) {
      return res.status(400).json({
        success: false,
        error: 'job_id is required to apply.'
      });
    }

    // Only admin can force override eligibility failures
    const canForce = force && req.user.role === 'admin';

    const application = await applicationService.applyForJob({
      studentId: targetStudentId,
      jobId: job_id,
      force: canForce
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application
    });
  } catch (err) {
    if (err.eligibilityAudit) {
      return res.status(err.statusCode || 400).json({
        success: false,
        error: err.message,
        eligibility: err.eligibilityAudit
      });
    }
    next(err);
  }
}

async function listApplications(req, res, next) {
  try {
    const filters = { ...req.query };

    // Role-based visibility enforcement
    if (req.user.role === 'student') {
      filters.student_id = req.user.id; // Force student to view only their applications
    }

    const applications = await applicationService.listApplications(filters);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
}

async function getApplicationById(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const application = await applicationService.getApplicationById(applicationId);

    // If student, ensure they only view their own application
    if (req.user.role === 'student' && application.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only view your own applications.'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const { status, bypass_transition_rules } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "status".'
      });
    }

    const updated = await applicationService.updateApplicationStatus({
      applicationId,
      newStatus: status.toLowerCase().trim(),
      userRole: req.user.role,
      bypassTransitionRules: Boolean(bypass_transition_rules)
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to '${updated.status}'.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

async function withdraw(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const studentId = req.user.role === 'student' ? req.user.id : req.body.student_id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'student_id required to withdraw.'
      });
    }

    const application = await applicationService.withdrawApplication(applicationId, studentId);

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
      data: application
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  apply,
  listApplications,
  getApplicationById,
  updateStatus,
  withdraw
};

