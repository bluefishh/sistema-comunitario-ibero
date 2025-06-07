const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');

const { CommunityController, joinCommunity } = require('../controllers/communitiesController');
const CommunityModel = require('../models/communitiesModel');

const communitiesController = new CommunityController(CommunityModel);

// Rutas para comunidades
router.get('/', communitiesController.getAllCommunities.bind(communitiesController));

// Ruta para unirse a una comunidad
router.post('/join', requireAuth, joinCommunity);

module.exports = router;