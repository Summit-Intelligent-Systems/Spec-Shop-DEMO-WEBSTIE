// Vercel serverless entrypoint. The regular src/main.ts starts a persistent
// listener, which is not supported inside a serverless function.
const { app } = require('../dist/apps/api/src/app');

module.exports = app;
