const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const AuthController = require('../controllers/authController');

const authController = new AuthController(UserModel);

// Ruta para procesar login en raiz	
router.get('/', (req, res) => authController.renderLogin(req, res));

// Rutas para el login y logout
router.post('/login', (req, res) => authController.login(req, res));
router.get('/logout', (req, res) => authController.logout(req, res));
router.get('/login', (req, res) => authController.renderLogin(req, res));

// Rutas para el registro de usuarios
router.get('/register', (req, res) => authController.renderRegister(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Ruta para crear un nuevo usuario
router.post('/create', (req, res) => authController.createUser(req, res));

module.exports = router;