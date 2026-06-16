const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'publichealth_cloud',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: '+00:00',
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    console.log(`   Database: ${process.env.DB_NAME || 'publichealth_cloud'}`);
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
