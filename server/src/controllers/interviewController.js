const interviewService = require('../services/interviewService');

async function schedule(req, res, next) {
  try {
    const { job_id, student_id, interviewer_name, interview_time, round_name, notes } = req.body;
    const interview = await interviewService.scheduleInterview({
      job_id,
      student_id,
      interviewer_name,
      interview_time,
      round_name,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Interview round scheduled successfully.',
      data: interview
    });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const filters = { ...req.query };

    // Students can only list their own interviews
    if (req.user.role === 'student') {
      filters.student_id = req.user.id;
    }

    const interviews = await interviewService.listInterviews(filters);

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const interviewId = parseInt(req.params.id, 10);
    const interview = await interviewService.getInterviewById(interviewId);

    if (req.user.role === 'student' && interview.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You can only view your own interview schedules.'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const interviewId = parseInt(req.params.id, 10);
    const updated = await interviewService.updateInterview(interviewId, req.body);

    res.status(200).json({
      success: true,
      message: 'Interview schedule updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  schedule,
  list,
  getById,
  update
};

