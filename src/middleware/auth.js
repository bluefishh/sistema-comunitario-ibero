// Middleware para verificar si el usuario está autenticado
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    res.redirect('/login');
}

module.exports = requireAuth;