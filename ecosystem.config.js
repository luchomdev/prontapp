module.exports = {
  apps: [{
    name: 'prontapp-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/frontend/logs/err.log',
    out_file: '/var/www/frontend/logs/out.log',
    log_file: '/var/www/frontend/logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
