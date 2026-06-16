const http = require('http');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'login_test_result.log');

const postData = JSON.stringify({
  username: 'admin',
  password: 'password'
});

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending mock login request to http://127.0.0.1:3001/api/auth/login...');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const logInfo = `RESPONSE STATUS: ${res.statusCode}
Headers: ${JSON.stringify(res.headers, null, 2)}
Body: ${data}
`;
    fs.writeFileSync(logPath, logInfo);
    console.log(`✅ Request completed! Status code: ${res.statusCode}`);
    console.log('Details written to login_test_result.log');
  });
});

req.on('error', (err) => {
  const logInfo = `REQUEST FAILURE: Could not connect to the backend server.
Error Message: ${err.message}
Error Code: ${err.code}
`;
  fs.writeFileSync(logPath, logInfo);
  console.error('❌ Request failed! Connection error written to login_test_result.log');
  console.error(err.message);
});

req.write(postData);
req.end();
