const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', status = '', severity = '', region = '', disease = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (dc.case_id LIKE ? OR dc.disease_name LIKE ? OR dc.patient_id LIKE ? OR dc.region LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) { whereClause += ' AND dc.status = ?'; params.push(status); }
    if (severity) { whereClause += ' AND dc.severity = ?'; params.push(severity); }
    if (region) { whereClause += ' AND dc.region = ?'; params.push(region); }
    if (disease) { whereClause += ' AND dc.disease_name = ?'; params.push(disease); }

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) as total FROM disease_cases dc ${whereClause}`,
      params
    );

    const [rows] = await pool.execute(
      `SELECT dc.*, u.full_name as reporter_name
       FROM disease_cases dc
       LEFT JOIN users u ON dc.created_by = u.id
       ${whereClause}
       ORDER BY dc.created_at DESC
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT dc.*, u.full_name as reporter_name FROM disease_cases dc
       LEFT JOIN users u ON dc.created_by = u.id WHERE dc.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Case not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { disease_name, patient_id, region, status, severity, date_reported, description, age, gender } = req.body;
    if (!disease_name || !patient_id || !region || !date_reported) {
      return res.status(400).json({ success: false, message: 'Required fields: disease_name, patient_id, region, date_reported.' });
    }

    const case_id = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const [result] = await pool.execute(
      `INSERT INTO disease_cases (case_id, disease_name, patient_id, region, status, severity, date_reported, description, age, gender, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [case_id, disease_name, patient_id, region, status || 'active', severity || 'mild', date_reported, description || '', age || null, gender || null, req.user.id]
    );

    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'CREATE', 'CASE', ?, ?)",
      [req.user.id, result.insertId.toString(), `Created case ${case_id}`]
    );

    res.status(201).json({ success: true, message: 'Case created successfully.', data: { id: result.insertId, case_id } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { disease_name, patient_id, region, status, severity, date_reported, description, age, gender } = req.body;
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT id, case_id FROM disease_cases WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Case not found.' });

    await pool.execute(
      `UPDATE disease_cases SET disease_name=?, patient_id=?, region=?, status=?, severity=?, date_reported=?, description=?, age=?, gender=?, updated_at=NOW()
       WHERE id=?`,
      [disease_name, patient_id, region, status, severity, date_reported, description, age, gender, id]
    );

    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'UPDATE', 'CASE', ?, ?)",
      [req.user.id, id.toString(), `Updated case ${existing[0].case_id}`]
    );

    res.json({ success: true, message: 'Case updated successfully.' });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT id, case_id FROM disease_cases WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Case not found.' });

    await pool.execute('DELETE FROM disease_cases WHERE id = ?', [id]);
    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'DELETE', 'CASE', ?, ?)",
      [req.user.id, id.toString(), `Deleted case ${existing[0].case_id}`]
    );

    res.json({ success: true, message: 'Case deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
