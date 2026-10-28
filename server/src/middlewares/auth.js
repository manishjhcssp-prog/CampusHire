const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'campushire_super_secret_dev_key';

/**
 * Middleware to verify JWT authentication token
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing or invalid format. Use Bearer <token>'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate user still exists in DB
    const user = await db.get(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired. Please log in again.'
      });
    }
    return res.status(403).json({
      success: false,
      error: 'Invalid or malformed authentication token.'
    });
  }
}

/**
 * Middleware to restrict access based on roles
 * @param  {...string} roles Allowed roles ('admin', 'recruiter', 'student')
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access denied for role '${req.user.role}'. Required one of: [${roles.join(', ')}]`
      });
    }

    next();
  };
}

/**
 * Middleware to restrict student profile/application access to the student themselves or an admin/recruiter
 */
function authorizeSelfOrRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required.'
      });
    }

    // If user has one of allowed roles (e.g. admin or recruiter), allow
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // If student, ensure they only access their own id
    const targetStudentId = parseInt(req.params.student_id || req.params.id || req.body.student_id, 10);
    if (req.user.role === 'student' && req.user.id === targetStudentId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden: You do not have permission to access or modify this resource.'
    });
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeSelfOrRoles
};

