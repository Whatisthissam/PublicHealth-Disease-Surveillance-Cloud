const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const getAll = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    let query = 'SELECT id, username, email, role, full_name, phone, region, department, is_active, created_at FROM users';
    const params = [];
    
    if (search) {
      query += ' WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ? OR role LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, full_name, phone, region, department, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { username, email, password, full_name, role, phone, region, department, is_active } = req.body;
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Required fields: username, email, password, full_name.' });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password_hash, full_name, role, phone, region, department, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password_hash, full_name, role || 'staff', phone || null, region || null, department || null, is_active !== undefined ? is_active : 1]
    );
    
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'CREATE', 'USER', ?, ?)",
      [req.user.id, result.insertId.toString(), `Created user ${username}`]
    );
    
    res.status(201).json({ success: true, message: 'User created successfully.', data: { id: result.insertId } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { username, email, password, full_name, role, phone, region, department, is_active } = req.body;
    const { id } = req.params;
    
    const [existing] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    
    let query = `UPDATE users SET username=?, email=?, full_name=?, role=?, phone=?, region=?, department=?, is_active=?, updated_at=NOW()`;
    const params = [username, email, full_name, role, phone || null, region || null, department || null, is_active, id];
    
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      query = `UPDATE users SET username=?, email=?, password_hash=?, full_name=?, role=?, phone=?, region=?, department=?, is_active=?, updated_at=NOW()`;
      params.splice(2, 0, password_hash);
    }
    
    query += ` WHERE id=?`;
    
    await pool.execute(query, params);
    
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'UPDATE', 'USER', ?, ?)",
      [req.user.id, id.toString(), `Updated user ${existing[0].username}`]
    );
    
    res.json({ success: true, message: 'User updated successfully.' });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'DELETE', 'USER', ?, ?)",
      [req.user.id, id.toString(), `Deleted user ${existing[0].username}`]
    );
    
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
