const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const UserCommunity = require('../models/userCommunityModel');
const UserController = require('../controllers/userController');

const userController = new UserController(UserModel, UserCommunity);

// Ruta para crear usuario desde el admin/modal
router.post('/create', (req, res) => userController.createUser(req, res));

// Ruta para mostrar el perfil del usuario autenticado
router.get('/profile', (req, res) => userController.getProfile(req, res));

// Ruta para obtener usuario por ID
router.get('/:id', (req, res) => userController.getUserById(req, res));

// Ruta para actualizar usuario
router.put('/update/:id', (req, res) => userController.updateUser(req, res));

// Ruta para eliminar usuario y todas sus relaciones en la colección UserCommunity
router.delete('/delete/:id', (req, res) => userController.deleteUser(req, res));

// Ruta para actualizar el perfil del usuario autenticado
router.put('/profile', (req, res) => userController.updateProfile(req, res));

module.exports = router;