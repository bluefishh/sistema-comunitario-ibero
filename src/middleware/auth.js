function requireAuth(req, res, next) {
    if (req.session.user) {
      return next();
    }
  
    // Si es una petición AJAX (fetch), responder con JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
  
    // Si es navegación normal, redirigir al login
    return res.redirect('/login');
  }
  
  module.exports = requireAuth;
  