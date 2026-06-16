require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'db_error.log');

async function test() {
  console.log('Testing connection to MySQL...');
  console.log('Host:', process.env.DB_HOST || '127.0.0.1');
  console.log('Port:', process.env.DB_PORT || 3306);
  console.log('User:', process.env.DB_USER || 'root');
  console.log('Database:', process.env.DB_NAME || 'publichealth_cloud');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'publichealth_cloud'
    });
    
    fs.writeFileSync(logPath, `SUCCESS: Connected successfully to database.\n`);
    console.log('✅ Connection test successful! Result written to db_error.log');
    await connection.end();
  } catch (err) {
    const errorDetails = `FAILURE: Database connection failed.
Error Message: ${err.message}
Error Code: ${err.code}
Error Number: ${err.errno}
Stack Trace: ${err.stack}
`;
    fs.writeFileSync(logPath, errorDetails);
    console.error('❌ Connection test failed! Error written to db_error.log');
    console.error(err.message);
  }
}

test();
