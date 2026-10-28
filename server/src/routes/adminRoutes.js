const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Dashboard & Reporting Analytics
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), adminController.getDashboardStats);

module.exports = router;

