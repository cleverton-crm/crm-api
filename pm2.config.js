module.exports = {
  apps: [
    {
      name: 'crm-api',
      script: './gateway/main.js',
      watch: false,
      wait_ready: true,
      stop_exit_codes: [0],
      env: {
        PORT: 5010,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
