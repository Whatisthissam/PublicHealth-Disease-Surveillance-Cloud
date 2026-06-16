const { pool } = require('../config/database');

const getRegions = async (req, res, next) => {
  try {
    const [regions] = await pool.execute(`
      SELECT r.*,
        COUNT(dc.id) as total_cases,
        SUM(CASE WHEN dc.status='active' THEN 1 ELSE 0 END) as active_cases,
        SUM(CASE WHEN dc.status='recovered' THEN 1 ELSE 0 END) as recovered_cases,
        SUM(CASE WHEN dc.severity='critical' THEN 1 ELSE 0 END) as critical_cases
      FROM regions r
      LEFT JOIN disease_cases dc ON r.name = dc.region
      GROUP BY r.id ORDER BY r.is_current DESC, total_cases DESC
    `);

    const [expansionPlan] = await pool.execute(
      "SELECT * FROM regions WHERE is_current = 0 ORDER BY priority ASC"
    );

    const [[{ totalPopulationCovered }]] = await pool.execute(
      "SELECT SUM(population) as totalPopulationCovered FROM regions WHERE is_current = 1"
    );

    res.json({
      success: true,
      data: {
        regions,
        currentRegions: regions.filter(r => r.is_current),
        expansionPlan,
        summary: {
          totalRegions: regions.length,
          activeRegions: regions.filter(r => r.is_current).length,
          plannedExpansions: expansionPlan.length,
          totalPopulationCovered,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRegions };
