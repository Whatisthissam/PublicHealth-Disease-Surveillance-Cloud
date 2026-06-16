const { pool } = require('../config/database');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '', assigned_to = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1'; const params = [];
    if (status) { where += ' AND wt.status = ?'; params.push(status); }
    if (assigned_to) { where += ' AND wt.assigned_to = ?'; params.push(assigned_to); }

    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) as total FROM workflow_tasks wt ${where}`, params);
    const [rows] = await pool.execute(
      `SELECT wt.*, u1.full_name as assigned_to_name, u2.full_name as created_by_name,
              dc.case_id as related_case_id, dc.disease_name
       FROM workflow_tasks wt
       LEFT JOIN users u1 ON wt.assigned_to = u1.id
       LEFT JOIN users u2 ON wt.created_by = u2.id
       LEFT JOIN disease_cases dc ON wt.case_id = dc.id
       ${where}
       ORDER BY wt.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    res.json({ success: true, data: rows, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await pool.execute(
      'UPDATE workflow_tasks SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?',
      [status, notes || null, id]
    );

    await pool.execute(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES (?, 'UPDATE', 'WORKFLOW', ?, ?)",
      [req.user.id, id.toString(), `Workflow status updated to ${status}`]
    );

    res.json({ success: true, message: 'Workflow status updated.' });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, assigned_to, case_id, priority, due_date } = req.body;
    const task_id = `TASK-${Date.now()}`;
    const [result] = await pool.execute(
      `INSERT INTO workflow_tasks (task_id, title, description, assigned_to, case_id, priority, due_date, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [task_id, title, description || '', assigned_to || null, case_id || null, priority || 'medium', due_date || null, req.user.id]
    );
    res.status(201).json({ success: true, message: 'Task created.', data: { id: result.insertId, task_id } });
  } catch (err) {
    next(err);
  }
};

const getAuditLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM audit_logs');
    const [rows] = await pool.execute(
      `SELECT al.*, u.full_name, u.username FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`
    );
    res.json({ success: true, data: rows, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, updateStatus, create, getAuditLog };
