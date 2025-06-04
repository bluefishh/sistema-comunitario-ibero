module.exports = function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    return res.redirect('/login');
  }
  next();
};
