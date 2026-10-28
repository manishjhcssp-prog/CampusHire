const analyticsService = require('../services/analyticsService');

async function getDashboardStats(req, res, next) {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats
};

