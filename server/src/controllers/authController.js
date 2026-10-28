const authService = require('../services/authService');
const studentService = require('../services/studentService');

async function register(req, res, next) {
  try {
    const { name, email, password, role, profile } = req.body;
    const result = await authService.registerUser({
      name,
      email,
      password,
      role: role || 'student',
      profile
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    let profileData = null;
    if (req.user.role === 'student') {
      profileData = await studentService.getStudentProfile(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        profile: profileData
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe
};

