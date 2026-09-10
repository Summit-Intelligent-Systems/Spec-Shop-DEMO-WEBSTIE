// Monorepo-root Vercel entrypoint for the API project.
let appInstance;

function getApp() {
  if (!appInstance) {
    let mod;
    try {
      mod = require('../apps/api/dist/apps/api/src/app');
    } catch {
      try {
        mod = require('../apps/api/dist/src/app');
      } catch {
        mod = require('./apps/api/dist/apps/api/src/app');
      }
    }
    appInstance = mod.default || mod.app || mod;
  }
  return appInstance;
}

module.exports = (req, res) => {
  const app = getApp();
  return app(req, res);
};
