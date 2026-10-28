const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Companies
router.get('/companies', authenticateToken, jobController.listCompanies);
router.post('/companies', authenticateToken, authorizeRoles('admin', 'recruiter'), jobController.createCompany);

// Automated Eligibility Checker Engine endpoints
router.post('/:id/check-eligibility/:student_id', authenticateToken, jobController.checkEligibility);
router.post('/:id/check-eligibility', authenticateToken, jobController.checkEligibility);

// Jobs CRUD
router.get('/', authenticateToken, jobController.listJobs);
router.get('/:id', authenticateToken, jobController.getJobById);
router.post('/', authenticateToken, authorizeRoles('admin', 'recruiter'), jobController.createJob);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'recruiter'), jobController.updateJob);
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'recruiter'), jobController.updateJob);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), jobController.deleteJob);

module.exports = router;

