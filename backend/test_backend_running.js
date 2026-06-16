const http = require('http');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'backend_status.log');

console.log('Testing connection to http://127.0.0.1:3001/api/health...');

const req = http.get('http://127.0.0.1:3001/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const statusInfo = `SUCCESS: Backend is running!
Status Code: ${res.statusCode}
Headers: ${JSON.stringify(res.headers, null, 2)}
Body: ${data}
`;
    fs.writeFileSync(logPath, statusInfo);
    console.log('✅ Backend is running and responded! Details written to backend_status.log');
  });
});

req.on('error', (err) => {
  const errorInfo = `FAILURE: Backend is not reachable on port 3001.
Error Message: ${err.message}
Error Code: ${err.code}
Stack Trace: ${err.stack}
`;
  fs.writeFileSync(logPath, errorInfo);
  console.error('❌ Failed to reach backend on port 3001! Details written to backend_status.log');
  console.error(err.message);
});

req.end();
