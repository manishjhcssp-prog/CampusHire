const studentService = require('../services/studentService');

async function getProfile(req, res, next) {
  try {
    const studentId = parseInt(req.params.id, 10);
    const profile = await studentService.getStudentProfile(studentId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const studentId = parseInt(req.params.id, 10);
    const updated = await studentService.updateStudentProfile(studentId, req.body);
    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

async function listStudents(req, res, next) {
  try {
    const { branch, min_cgpa, max_backlogs, search } = req.query;
    const students = await studentService.listStudents({
      branch,
      min_cgpa,
      max_backlogs,
      search
    });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  listStudents
};

