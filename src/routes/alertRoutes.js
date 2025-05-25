const express = require('express');
const AlertModel = require('../models/alertModel');
const AlertController = require('../controllers/alertController');

const router = express.Router();
const alertController = new AlertController(AlertModel);

// Ruta para obtener alertas por comunidad
router.get('/', (req, res) => {
    req.usuarioNombre = req.session.nombre;
    req.params.comunidadId = req.session.comunidadId;
    alertController.getAlertsByCommunity(req, res);
});

// Ruta para crear una nueva alerta
router.post('/create', async (req, res) => {
    req.body.publicador = req.session.userId; 
    req.body.comunidad = req.session.comunidadId;
    await alertController.createAlert(req, res);
});

// Eliminar alerta
router.delete('/delete/:id', async (req, res) => {
    await alertController.deleteAlert(req, res);
});

// Obtener alerta por id
router.get('/:id', async (req, res) => {
    await alertController.getAlertById(req, res);
});

// Actualizar alerta
router.put('/update/:id', async (req, res) => {
    await alertController.updateAlert(req, res);
});

// Aprobar alerta
router.put('/approve/:id', async (req, res) => {
    await alertController.approveAlert(req, res);
});

// Rechazar alerta
router.put('/reject/:id', async (req, res) => {
    await alertController.rejectAlert(req, res);
});

module.exports = router;