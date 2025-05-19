const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Renderiza el formulario de login en la ruta raíz
router.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Procesa el login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    const user = await User.findOne({ correo });
    if (!user || !(await user.comparePassword(contrasena))) {
        return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
    req.session.userId = user._id;
    res.redirect('/alerts/all');
});

// Cierra sesión y redirige al login
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Renderiza el formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Renderiza el formulario de registro
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Procesar registro
router.post('/register', async (req, res) => {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena, confirmarContrasena } = req.body;
    if (contrasena !== confirmarContrasena) {
        return res.render('register', { error: 'Las contraseñas no coinciden' });
    }
    try {
        const existe = await User.findOne({ correo });
        if (existe) {
            return res.render('register', { error: 'El correo ya está registrado' });
        }
        const nuevoUsuario = new User({
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            correo,
            contrasena,
            rol: 'residente'
        });
        await nuevoUsuario.save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

module.exports = router;