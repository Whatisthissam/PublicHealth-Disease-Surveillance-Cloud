const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, role, full_name, is_active FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log audit
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, description) VALUES (?, 'LOGIN', 'AUTH', 'User logged in')",
      [user.id]
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, full_name, phone, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, description) VALUES (?, 'LOGOUT', 'AUTH', 'User logged out')",
      [req.user.id]
    );
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name, phone, region, department } = req.body;
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Username, email, password, and full name are required.' });
    }

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password_hash, full_name, role, phone, region, department, is_active)
       VALUES (?, ?, ?, ?, 'staff', ?, ?, ?, 1)`,
      [username, email, password_hash, full_name, phone || null, region || null, department || null]
    );

    // Create audit log
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'CREATE', 'USER', ?, ?)",
      [result.insertId, result.insertId.toString(), `Self-registered user ${username}`]
    );

    res.status(201).json({ success: true, message: 'User registered successfully. You can now login.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getProfile, logout, register };
