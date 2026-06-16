const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'server.log');
const out = fs.openSync(logPath, 'a');
const err = fs.openSync(logPath, 'a');

console.log('Starting backend server in the background...');
console.log(`Logs will be written to: ${logPath}`);

const child = spawn('node', ['index.js'], {
  cwd: __dirname,
  detached: true,
  stdio: [ 'ignore', out, err ]
});

child.unref();

console.log(`🚀 Backend server launched successfully in the background! (PID: ${child.pid})`);
console.log('You can now safely close this terminal window.');
process.exit(0);
