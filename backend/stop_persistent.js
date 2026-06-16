const { exec } = require('child_process');

console.log('Stopping any background backend servers running on port 3001...');

exec('lsof -t -i:3001', (err, stdout) => {
  if (err || !stdout.trim()) {
    console.log('No backend server found running on port 3001.');
    process.exit(0);
  }
  
  const pids = stdout.trim().split('\n');
  let killedCount = 0;
  
  pids.forEach(pid => {
    try {
      process.kill(parseInt(pid), 'SIGKILL');
      console.log(`🛑 Stopped backend server process (PID: ${pid})`);
      killedCount++;
    } catch (e) {
      console.error(`Failed to stop process ${pid}: ${e.message}`);
    }
  });
  
  if (killedCount === 0) {
    console.log('No processes were stopped.');
  }
});
