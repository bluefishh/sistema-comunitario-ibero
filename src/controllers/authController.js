class AuthController {
    constructor(UserModel) {
        this.User = UserModel;
    }

    // Renderizar la página del login
    renderLogin(req, res) {
        res.render('login', { error: null });
    }

    // Valida el login
    async login(req, res) {
        const { correo, contrasena } = req.body;
        const user = await this.User.buscarPorCorreo(correo);
        if (!user || !(await user.comparePassword(contrasena))) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
        req.session.userId = user._id;
        req.session.nombre = user.primerNombre + ' ' + user.primerApellido;
        req.session.rol = user.rol;
        res.redirect('/communities');
    }

    // Renderizar la página de logout
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }

    // Renderizar la página de registro
    renderRegister(req, res) {
        res.render('register', { error: null, formData: {} });
    }

    // Valida el registro
    async register(req, res) {
        const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena, confirmarContrasena } = req.body;
        if (contrasena !== confirmarContrasena) {
            return res.render('register', { 
                error: 'Las contraseñas no coinciden',
                formData: { primerNombre, segundoNombre, primerApellido, segundoApellido, correo }
            });
        }
        try {
            const existe = await this.User.buscarPorCorreo(correo);
            if (existe) {
                return res.render('register', { 
                    error: 'El correo ya está registrado',
                    formData: { primerNombre, segundoNombre, primerApellido, segundoApellido, correo }
                });
            }
            await this.User.crearUsuario({
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                correo,
                contrasena,
                rol: 'residente'
            });
            res.redirect('/login');
        } catch (err) {
            res.render('register', { 
                error: 'Error al registrar usuario',
                formData: { primerNombre, segundoNombre, primerApellido, segundoApellido, correo }
            });
        }
    }

    // Crear un nuevo usuario
    async createUser(req, res) {
        const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena, rol } = req.body;
        try {
            const existe = await this.User.buscarPorCorreo(correo);
            if (existe) {
                return res.json({ success: false, message: 'El correo ya está registrado' });
            }
            await this.User.crearUsuario({
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                correo,
                contrasena,
                rol: rol || 'residente'
            });
            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: 'Error al crear usuario' });
        }
    }
}

module.exports = AuthController;