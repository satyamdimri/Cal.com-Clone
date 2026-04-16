module.exports = (_req, res, _next) => {
  res.locals.user = { id: process.env.DEFAULT_USER_ID || null };
  return _next();
};
