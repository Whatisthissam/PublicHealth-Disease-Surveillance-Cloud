require('dotenv').config();
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'query_result.log');

async function query() {
  try {
    const [users] = await pool.execute('SELECT id, username, email, role, is_active FROM users');
    const [audits] = await pool.execute('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 10');
    
    const output = {
      users,
      audits
    };
    
    fs.writeFileSync(logPath, JSON.stringify(output, null, 2));
    console.log('✅ Query successful! Result written to query_result.log');
  } catch (err) {
    fs.writeFileSync(logPath, `ERROR: ${err.message}\nStack: ${err.stack}\n`);
    console.error('❌ Query failed! Error written to query_result.log');
  }
}

query();
