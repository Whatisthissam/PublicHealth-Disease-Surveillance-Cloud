const { pool } = require('../config/database');

const getAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;

    const [byDisease] = await pool.execute(`
      SELECT disease_name,
        COUNT(*) as total,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered,
        SUM(CASE WHEN status='deceased' THEN 1 ELSE 0 END) as deceased,
        SUM(CASE WHEN severity='critical' THEN 1 ELSE 0 END) as critical
      FROM disease_cases GROUP BY disease_name ORDER BY total DESC
    `);

    const [byRegion] = await pool.execute(`
      SELECT region,
        COUNT(*) as total,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered,
        ROUND(SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) as recovery_rate
      FROM disease_cases GROUP BY region ORDER BY total DESC
    `);

    const [bySeverity] = await pool.execute(`
      SELECT severity, COUNT(*) as count FROM disease_cases GROUP BY severity
    `);

    const [byStatus] = await pool.execute(`
      SELECT status, COUNT(*) as count FROM disease_cases GROUP BY status
    `);

    const [trend] = await pool.execute(`
      SELECT DATE_FORMAT(date_reported, '%Y-%m') as month,
             disease_name, COUNT(*) as count
      FROM disease_cases
      WHERE YEAR(date_reported) = ?
      GROUP BY month, disease_name ORDER BY month
    `, [year]);

    const [weeklyTrend] = await pool.execute(`
      SELECT DATE_FORMAT(date_reported, '%Y-%u') as week,
             COUNT(*) as total,
             SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered
      FROM disease_cases
      WHERE date_reported >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)
      GROUP BY week ORDER BY week
    `);

    const [ageDistribution] = await pool.execute(`
      SELECT
        CASE
          WHEN age < 18 THEN '0-17'
          WHEN age BETWEEN 18 AND 34 THEN '18-34'
          WHEN age BETWEEN 35 AND 49 THEN '35-49'
          WHEN age BETWEEN 50 AND 64 THEN '50-64'
          ELSE '65+'
        END as age_group,
        COUNT(*) as count
      FROM disease_cases WHERE age IS NOT NULL GROUP BY age_group
    `);

    const [[outbreakStats]] = await pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM disease_cases WHERE date_reported >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as last_30_days,
        (SELECT COUNT(*) FROM disease_cases WHERE date_reported >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) as last_7_days,
        (SELECT COUNT(*) FROM disease_cases WHERE date_reported >= CURDATE()) as today
    `);

    res.json({
      success: true,
      data: { byDisease, byRegion, bySeverity, byStatus, trend, weeklyTrend, ageDistribution, outbreakStats }
    });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '', type = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1'; const params = [];
    if (status) { where += ' AND r.status = ?'; params.push(status); }
    if (type) { where += ' AND r.report_type = ?'; params.push(type); }

    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) as total FROM reports r ${where}`, params);
    const [rows] = await pool.execute(
      `SELECT r.*, u.full_name as created_by_name FROM reports r
       LEFT JOIN users u ON r.created_by = u.id ${where}
       ORDER BY r.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    res.json({ success: true, data: rows, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    next(err);
  }
};

const createReport = async (req, res, next) => {
  try {
    const { title, report_type, period_start, period_end, summary, region } = req.body;
    const report_id = `RPT-${Date.now()}`;
    const [result] = await pool.execute(
      `INSERT INTO reports (report_id, title, report_type, period_start, period_end, summary, region, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [report_id, title, report_type, period_start, period_end, summary || '', region || 'All', req.user.id]
    );
    res.status(201).json({ success: true, message: 'Report created.', data: { id: result.insertId, report_id } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getReports, createReport };
