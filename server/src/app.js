const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & API sitemap
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to CampusHire Placement Management Portal API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      jobs: {
        list: 'GET /api/jobs',
        get: 'GET /api/jobs/:id',
        create: 'POST /api/jobs',
        eligibilityChecker: 'POST /api/jobs/:id/check-eligibility/:student_id'
      },
      applications: {
        apply: 'POST /api/applications',
        list: 'GET /api/applications',
        statusWorkflow: 'PATCH /api/applications/:id/status',
        withdraw: 'POST /api/applications/:id/withdraw'
      },
      interviews: {
        schedule: 'POST /api/interviews',
        list: 'GET /api/interviews',
        update: 'PATCH /api/interviews/:id'
      },
      admin: {
        dashboardStats: 'GET /api/admin/dashboard-stats'
      }
    }
  });
});

// Mount API router
app.use('/api', apiRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}. Route not found.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

