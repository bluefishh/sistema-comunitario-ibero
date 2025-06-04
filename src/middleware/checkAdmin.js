// src/middleware/checkAdmin.js
module.exports = function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.rol === 'admin') {
      return next();
    }
  
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
    }
  
    res.status(403).send('Acceso denegado');
  };
  