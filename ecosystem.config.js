module.exports = {
  apps: [{
    name: 'prontapp-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/prontapp-frontend-error.log',
    out_file: '/var/log/pm2/prontapp-frontend-out.log',
    log_file: '/var/log/pm2/prontapp-frontend.log',
    time: true
  }]
}