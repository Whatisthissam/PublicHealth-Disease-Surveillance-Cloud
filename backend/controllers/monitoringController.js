const { pool } = require('../config/database');
const os = require('os');

const getMonitoringData = async (req, res, next) => {
  try {
    // System metrics (simulated for demo; in prod would use CloudWatch)
    const cpuUsage = Math.round(20 + Math.random() * 45);
    const memUsage = Math.round(40 + Math.random() * 30);
    const storageUsage = Math.round(30 + Math.random() * 25);
    const networkIn = Math.round(50 + Math.random() * 200);
    const networkOut = Math.round(20 + Math.random() * 100);

    const [alerts] = await pool.execute(`
      SELECT al.*, u.full_name as created_by_name
      FROM alerts al LEFT JOIN users u ON al.created_by = u.id
      ORDER BY al.created_at DESC LIMIT 30
    `);

    const [[{ activeAlerts }]] = await pool.execute(
      "SELECT COUNT(*) as activeAlerts FROM alerts WHERE status = 'active'"
    );
    const [[{ criticalAlerts }]] = await pool.execute(
      "SELECT COUNT(*) as criticalAlerts FROM alerts WHERE status = 'active' AND severity = 'critical'"
    );

    const services = [
      { name: 'API Server', status: 'operational', uptime: '99.98%', latency: Math.round(12 + Math.random() * 20) + 'ms' },
      { name: 'MySQL Database', status: 'operational', uptime: '99.95%', latency: Math.round(2 + Math.random() * 5) + 'ms' },
      { name: 'Authentication Service', status: 'operational', uptime: '100%', latency: Math.round(5 + Math.random() * 10) + 'ms' },
      { name: 'Report Generator', status: 'operational', uptime: '99.90%', latency: Math.round(80 + Math.random() * 100) + 'ms' },
      { name: 'Alert Engine', status: 'operational', uptime: '99.99%', latency: Math.round(3 + Math.random() * 7) + 'ms' },
    ];

    const [historicalMetrics] = await pool.execute(`
      SELECT DATE_FORMAT(created_at, '%H:%i') as time,
             alert_type, severity
      FROM alerts
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      ORDER BY created_at DESC LIMIT 100
    `);

    res.json({
      success: true,
      data: {
        metrics: { cpuUsage, memUsage, storageUsage, networkIn, networkOut },
        alerts,
        summary: { activeAlerts, criticalAlerts },
        services,
        historicalMetrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute(
      "UPDATE alerts SET status = 'resolved', resolved_at = NOW(), resolved_by = ? WHERE id = ?",
      [req.user.id, id]
    );
    res.json({ success: true, message: 'Alert acknowledged.' });
  } catch (err) {
    next(err);
  }
};

const createAlert = async (req, res, next) => {
  try {
    const { title, message, alert_type, severity, region } = req.body;
    const alert_id = `ALERT-${Date.now()}`;
    await pool.execute(
      `INSERT INTO alerts (alert_id, title, message, alert_type, severity, region, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
      [alert_id, title, message, alert_type || 'system', severity || 'medium', region || null, req.user.id]
    );
    res.status(201).json({ success: true, message: 'Alert created.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMonitoringData, acknowledgeAlert, createAlert };
