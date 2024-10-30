module.exports = {
    apps: [{
      name: 'frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://api.prontapp.co/api/v1'
      }
    }]
  }