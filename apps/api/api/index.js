let appInstance;

function getApp() {
  if (!appInstance) {
    let mod;
    try {
      mod = require('../dist/apps/api/src/app');
    } catch {
      try {
        mod = require('../dist/src/app');
      } catch {
        mod = require('../../dist/apps/api/src/app');
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

