// Root-level Vercel API entrypoint for monorepo deployments.
// This allows a repo-root Vercel project to serve the backend Express app.
const app = require('../backend/src/app');

module.exports = async (req, res) => {
  return app(req, res);
};

