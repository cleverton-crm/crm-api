module.exports = {
  apps: [
    {
      name: 'micro-api',
      script: './dist/main.js',
      watch: false,
      wait_ready: true,
      stop_exit_codes: [0],
      env: {
        PORT: 4000,
      },
      env: '.env',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
