const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRoles, authorizeSelfOrRoles } = require('../middlewares/auth');

// List students - only recruiter and admin
router.get('/', authenticateToken, authorizeRoles('admin', 'recruiter'), studentController.listStudents);

// Get specific student profile - student self, recruiter, or admin
router.get('/:id', authenticateToken, authorizeSelfOrRoles('admin', 'recruiter'), studentController.getProfile);

// Update student profile - student self or admin
router.put('/:id', authenticateToken, authorizeSelfOrRoles('admin'), studentController.updateProfile);
router.patch('/:id', authenticateToken, authorizeSelfOrRoles('admin'), studentController.updateProfile);

module.exports = router;

