// Vercel serverless catch-all to run the Express backend.
// This lets you deploy the `backend/` folder to Vercel and use `/api/*` routes.
const app = require('../src/app');

module.exports = async (req, res) => {
  return app(req, res);
};

