const express = require('express');
const LocalCommerceModel = require('../models/localCommerceModel');
const LocalCommerceController = require('../controllers/localCommerceController');

const router = express.Router();
const localCommerceController = new LocalCommerceController(LocalCommerceModel);

// Ruta para obtener las ofertas por communidad
router.get('/', (req, res) => {
    req.usuarioNombre = req.session.nombre;
    req.params.comunidadId = req.session.comunidadId;
    localCommerceController.getOffersByCommunity(req, res);
});

// Ruta para crear una nueva oferta
router.post('/create', async (req, res) => {
    req.body.publicador = req.session.userId;
    req.body.comunidad = req.session.comunidadId;
    await localCommerceController.createOffer(req, res);
});

// Eliminar oferta
router.delete('/delete/:id', async (req, res) => {
    await localCommerceController.deleteOffer(req, res);
});

// Obtener oferta por id
router.get('/:id', async (req, res) => {
    await localCommerceController.getOfferById(req, res);
});

// Actualizar oferta
router.put('/update/:id', async (req, res) => {
    await localCommerceController.updateOffer(req, res);
});

// Aprobar oferta
router.put('/approve/:id', async (req, res) => {
    await localCommerceController.approveOffer(req, res);
});

// Rechazar oferta
router.put('/reject/:id', async (req, res) => {
    await localCommerceController.rejectOffer(req, res);
});

module.exports = router;