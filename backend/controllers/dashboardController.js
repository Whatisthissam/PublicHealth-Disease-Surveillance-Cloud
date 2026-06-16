const { pool } = require('../config/database');

const getStats = async (req, res, next) => {
  try {
    const [[totalCases]] = await pool.execute('SELECT COUNT(*) as count FROM disease_cases');
    const [[activeCases]] = await pool.execute("SELECT COUNT(*) as count FROM disease_cases WHERE status = 'active'");
    const [[recoveredCases]] = await pool.execute("SELECT COUNT(*) as count FROM disease_cases WHERE status = 'recovered'");
    const [[criticalCases]] = await pool.execute("SELECT COUNT(*) as count FROM disease_cases WHERE severity = 'critical'");
    const [[pendingReports]] = await pool.execute("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
    const [[totalRegions]] = await pool.execute('SELECT COUNT(*) as count FROM regions');
    const [[totalUsers]] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    const [[pendingWorkflow]] = await pool.execute("SELECT COUNT(*) as count FROM workflow_tasks WHERE status = 'pending'");

    const [recentCases] = await pool.execute(`
      SELECT dc.case_id, dc.disease_name, dc.region, dc.status, dc.severity, dc.date_reported,
             u.full_name as reported_by
      FROM disease_cases dc
      LEFT JOIN users u ON dc.created_by = u.id
      ORDER BY dc.created_at DESC LIMIT 10
    `);

    const [regionalStats] = await pool.execute(`
      SELECT region, COUNT(*) as total,
             SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
             SUM(CASE WHEN status = 'recovered' THEN 1 ELSE 0 END) as recovered,
             SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical
      FROM disease_cases
      GROUP BY region ORDER BY total DESC
    `);

    const [diseaseTrend] = await pool.execute(`
      SELECT disease_name, COUNT(*) as count
      FROM disease_cases
      GROUP BY disease_name
      ORDER BY count DESC LIMIT 8
    `);

    const [monthlyCases] = await pool.execute(`
      SELECT DATE_FORMAT(date_reported, '%Y-%m') as month,
             COUNT(*) as total,
             SUM(CASE WHEN status = 'recovered' THEN 1 ELSE 0 END) as recovered
      FROM disease_cases
      WHERE date_reported >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY month ORDER BY month
    `);

    res.json({
      success: true,
      data: {
        kpis: {
          totalCases: totalCases.count,
          activeCases: activeCases.count,
          recoveredCases: recoveredCases.count,
          criticalCases: criticalCases.count,
          pendingReports: pendingReports.count,
          totalRegions: totalRegions.count,
          totalUsers: totalUsers.count,
          pendingWorkflow: pendingWorkflow.count,
        },
        recentCases,
        regionalStats,
        diseaseTrend,
        monthlyCases,
        systemStatus: {
          api: 'operational',
          database: 'operational',
          storage: 'operational',
          monitoring: 'operational',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
