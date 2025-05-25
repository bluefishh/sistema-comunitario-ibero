const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware para proteger solo admins
function isAdmin(req, res, next) {
    if (req.session.rol === 'admin') return next();
    res.status(403).send('Acceso denegado');
}

router.use(isAdmin);
// Ruta para cargar el panel de administración
router.get('/', adminController.getAdminPanel);

module.exports = router;