const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Schedule interview round (recruiter, admin)
router.post('/', authenticateToken, authorizeRoles('admin', 'recruiter'), interviewController.schedule);

// List interview schedules (scoped: student gets their own, recruiter/admin gets all)
router.get('/', authenticateToken, interviewController.list);

// Get interview detail
router.get('/:id', authenticateToken, interviewController.getById);

// Update / reschedule interview round (recruiter, admin)
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'recruiter'), interviewController.update);

module.exports = router;

