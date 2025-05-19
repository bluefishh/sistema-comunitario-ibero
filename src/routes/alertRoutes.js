const express = require('express');
const AlertModel = require('../models/alertModel');
const AlertController = require('../controllers/alertController');

const router = express.Router();
const alertController = new AlertController(AlertModel);

// Ruta para obtener todas las alertas
router.get('/', alertController.getAllAlerts.bind(alertController));

// Aquí van las rutas para createAlert, getAlertById, updateAlert y deleteAlert

module.exports = router;