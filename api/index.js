// Monorepo-root Vercel entrypoint for the API project.
// `turbo run build` emits the compiled Express app at this path.
const { app } = require('../apps/api/dist/apps/api/src/app');

module.exports = app;
