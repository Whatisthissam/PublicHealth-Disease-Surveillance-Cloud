const { pool } = require('../config/database');

const getExecutiveSummary = async (req, res, next) => {
  try {
    const [[totals]] = await pool.execute(`
      SELECT
        COUNT(*) as totalCases,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as activeCases,
        SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recoveredCases,
        SUM(CASE WHEN status='deceased' THEN 1 ELSE 0 END) as deceasedCases,
        SUM(CASE WHEN severity='critical' THEN 1 ELSE 0 END) as criticalCases,
        ROUND(SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) as overallRecoveryRate
      FROM disease_cases
    `);

    const [[monthlyComparison]] = await pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM disease_cases WHERE MONTH(date_reported)=MONTH(CURDATE()) AND YEAR(date_reported)=YEAR(CURDATE())) as thisMonth,
        (SELECT COUNT(*) FROM disease_cases WHERE MONTH(date_reported)=MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH)) AND YEAR(date_reported)=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))) as lastMonth
    `);

    const [regionalPerformance] = await pool.execute(`
      SELECT region,
        COUNT(*) as total,
        SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered,
        ROUND(SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) as recovery_rate,
        SUM(CASE WHEN severity='critical' THEN 1 ELSE 0 END) as critical,
        MAX(date_reported) as last_case_date
      FROM disease_cases GROUP BY region ORDER BY total DESC
    `);

    const [topDiseases] = await pool.execute(`
      SELECT disease_name, COUNT(*) as count,
        ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM disease_cases),1) as percentage,
        SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered
      FROM disease_cases GROUP BY disease_name ORDER BY count DESC LIMIT 6
    `);

    const [monthlyTrend] = await pool.execute(`
      SELECT DATE_FORMAT(date_reported,'%b %Y') as month_label,
             DATE_FORMAT(date_reported,'%Y-%m') as month,
             COUNT(*) as cases,
             SUM(CASE WHEN status='recovered' THEN 1 ELSE 0 END) as recovered
      FROM disease_cases
      WHERE date_reported >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY month, month_label ORDER BY month
    `);

    const [resourceUtilization] = await pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_active=1) as activeStaff,
        (SELECT COUNT(*) FROM workflow_tasks WHERE status='pending') as pendingTasks,
        (SELECT COUNT(*) FROM reports WHERE status='pending') as pendingReports,
        (SELECT COUNT(*) FROM alerts WHERE status='active') as activeAlerts,
        (SELECT COUNT(*) FROM regions WHERE status='active') as activeRegions
    `);

    const growthRate = monthlyComparison.lastMonth > 0
      ? (((monthlyComparison.thisMonth - monthlyComparison.lastMonth) / monthlyComparison.lastMonth) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        totals: { ...totals, growthRate },
        monthlyComparison,
        regionalPerformance,
        topDiseases,
        monthlyTrend,
        resourceUtilization: resourceUtilization[0],
        riskLevel: totals.criticalCases > 10 ? 'high' : totals.criticalCases > 5 ? 'medium' : 'low',
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExecutiveSummary };
