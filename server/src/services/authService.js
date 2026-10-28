const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'campushire_super_secret_dev_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Register a user and optionally initialize a student profile if role is 'student'
 */
async function registerUser({ name, email, password, role, profile }) {
  if (!name || !email || !password || !role) {
    const error = new Error('Name, email, password, and role are required.');
    error.statusCode = 400;
    throw error;
  }

  const validRoles = ['admin', 'recruiter', 'student'];
  if (!validRoles.includes(role)) {
    const error = new Error(`Invalid role '${role}'. Must be one of: ${validRoles.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // Check email uniqueness
  const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing) {
    const error = new Error('A user with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const normalizedEmail = email.toLowerCase().trim();

  const insertUserResult = await db.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name.trim(), normalizedEmail, hashedPassword, role]
  );

  const userId = insertUserResult.lastID;

  // If role is student, create or initialize profile
  if (role === 'student') {
    const course = profile?.course || 'B.Tech';
    const graduationYear = profile?.graduation_year || new Date().getFullYear();
    const cgpa = profile?.cgpa !== undefined ? parseFloat(profile.cgpa) : 0.0;
    const backlogsCount = profile?.backlogs_count !== undefined ? parseInt(profile.backlogs_count, 10) : 0;
    const branch = (profile?.branch || 'CSE').toUpperCase().trim();
    const skills = JSON.stringify(profile?.skills || []);
    const resumeUrl = profile?.resume_url || null;

    await db.run(
      `INSERT INTO student_profiles (student_id, course, graduation_year, cgpa, backlogs_count, branch, skills, resume_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, course, graduationYear, cgpa, backlogsCount, branch, skills, resumeUrl]
    );
  }

  const user = await db.get(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  const token = generateToken(user);

  let studentProfile = null;
  if (role === 'student') {
    studentProfile = await db.get(
      'SELECT * FROM student_profiles WHERE student_id = ?',
      [userId]
    );
    if (studentProfile) {
      studentProfile.skills = JSON.parse(studentProfile.skills || '[]');
    }
  }

  return { user, token, profile: studentProfile };
}

/**
 * Log in an existing user
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await db.get(
    'SELECT * FROM users WHERE email = ?',
    [normalizedEmail]
  );

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  let studentProfile = null;
  if (user.role === 'student') {
    studentProfile = await db.get(
      'SELECT * FROM student_profiles WHERE student_id = ?',
      [user.id]
    );
    if (studentProfile) {
      studentProfile.skills = JSON.parse(studentProfile.skills || '[]');
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    },
    token,
    profile: studentProfile
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  registerUser,
  loginUser
};

