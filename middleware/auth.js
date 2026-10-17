function authCheck(req, res, next) {
  // Simulated auth - always passes in dev, but exercises the middleware chain
  req.user = { id: 'usr_demo', role: 'editor' };
  next();
}
module.exports = { authCheck };
