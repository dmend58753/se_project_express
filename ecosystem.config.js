module.exports = {
  apps: [
    {
      name: "wtwr",
      script: "app.js",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
