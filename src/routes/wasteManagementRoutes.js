const express = require('express');
const WasteManagementController = require('../controllers/wasteManagementController');

const router = express.Router();
const wasteManagementController = new WasteManagementController();

// Página principal de gestión de residuos
router.get('/', (req, res) => {
    wasteManagementController.getWasteManagementPage(req, res);
});

// Crear campaña
router.post('/campaigns/create', (req, res) => {
    req.body.comunidad = req.session.comunidadId;
    wasteManagementController.createCampaign(req, res);
});

// Obtener campaña por ID (para ver o editar)
router.get('/campaigns/:id', (req, res) => {
    wasteManagementController.getCampaign(req, res);
});

// Actualizar campaña
router.put('/campaigns/update/:id', (req, res) => {
    wasteManagementController.updateCampaign(req, res);
});

// Eliminar campaña
router.delete('/campaigns/delete/:id', (req, res) => {
    wasteManagementController.deleteCampaign(req, res);
});

// Aprobar campaña
router.put('/campaigns/approve/:id', async (req, res) => {
    await wasteManagementController.approveCampaign(req, res);
});

// Rechazar campaña
router.put('/campaigns/reject/:id', async (req, res) => {
    await wasteManagementController.rejectCampaign(req, res);
});

// Actualizar horario de un día específico
router.put('/schedule/update', (req, res) => {
    req.body.comunidadId = req.session.comunidadId;
    wasteManagementController.updateScheduleDay(req, res);
});

// Obtener punto de recolección por ID (para ver o editar)
router.get('/collection-points/:id', (req, res) => {
    wasteManagementController.getCollectionPoint(req, res);
});

// Actualizar punto de recolección
router.put('/collection-points/update/:id', (req, res) => {
    wasteManagementController.updateCollectionPoint(req, res);
});

// Crear punto de recolección
router.post('/collection-points/create', (req, res) => {
    req.body.comunidad = req.session.comunidadId;
    wasteManagementController.createCollectionPoint(req, res);
});

// Eliminar punto de recolección
router.delete('/collection-points/delete/:id', (req, res) => {
    wasteManagementController.deleteCollectionPoint(req, res);
});

module.exports = router;