const express = require('express');
const router = express.Router();
const {
  getPanelResiduos,
  crearCampania,
  eliminarCampania,
  editarCampania,
  crearHorario,
  editarHorario,
  eliminarHorario,
  crearPunto,
  editarPunto,
  eliminarPunto
} = require('../controllers/residuos.controller');

const ensureAuthenticated = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', ensureAuthenticated, getPanelResiduos);

// 🛡️ Solo admins
router.post('/crear-campania', ensureAuthenticated, checkAdmin, crearCampania);
router.post('/campania/eliminar/:id', ensureAuthenticated, checkAdmin, eliminarCampania);
router.post('/campania/editar/:id', ensureAuthenticated, checkAdmin, editarCampania);

router.post('/horario', ensureAuthenticated, checkAdmin, crearHorario);
router.post('/horario/editar/:id', ensureAuthenticated, checkAdmin, editarHorario);
router.post('/horario/eliminar/:id', ensureAuthenticated, checkAdmin, eliminarHorario);

router.post('/punto', ensureAuthenticated, checkAdmin, crearPunto);
router.post('/punto/editar/:id', ensureAuthenticated, checkAdmin, editarPunto);
router.post('/punto/eliminar/:id', ensureAuthenticated, checkAdmin, eliminarPunto);

module.exports = router;
