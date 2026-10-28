const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles, authorizeSelfOrRoles } = require('../middlewares/auth');

// Apply for job (student, or admin on behalf of student)
router.post('/', authenticateToken, authorizeRoles('student', 'admin'), applicationController.apply);

// List applications (students get their own, recruiters/admins get full or filtered list)
router.get('/', authenticateToken, applicationController.listApplications);

// View application details (student self, recruiter, admin)
router.get('/:id', authenticateToken, applicationController.getApplicationById);

// Update application workflow status (recruiter or admin)
router.patch('/:id/status', authenticateToken, authorizeRoles('admin', 'recruiter'), applicationController.updateStatus);

// Withdraw application (student self)
router.post('/:id/withdraw', authenticateToken, authorizeRoles('student', 'admin'), applicationController.withdraw);

module.exports = router;

