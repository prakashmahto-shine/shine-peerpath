module.exports = {
  apps: [
    {
      name: 'shine-peerpath-server',
      script: 'node_modules/.bin/tsx',
      args: 'server/index.ts',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    }
  ]
};
