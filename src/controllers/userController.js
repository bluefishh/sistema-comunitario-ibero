class UserController {
    constructor(UserModel, UserCommunityModel) {
        this.User = UserModel;
        this.UserCommunity = UserCommunityModel;
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

    // Obtener usuario por ID
    async getUserById(req, res) {
        try {
            const user = await this.User.buscarPorId(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(404).json({});
        }
    }

    // Actualizar usuario
    async updateUser(req, res) {
        try {
            const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, rol } = req.body;
            await this.User.actualizarUsuario(req.params.id, {
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                correo,
                rol
            });
            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: 'Error al actualizar usuario' });
        }
    }

    // Actualizar solo la contraseña del usuario autenticado
    async updateProfile(req, res) {
        try {
            const userId = req.session.userId;
            const { contrasena } = req.body;

            if (!userId || !contrasena) {
                return res.json({ success: false, message: 'Datos incompletos' });
            }

            // Busca el usuario y actualiza la contraseña
            const user = await this.User.buscarPorId(userId);
            if (!user) {
                return res.json({ success: false, message: 'Usuario no encontrado' });
            }

            user.contrasena = contrasena;
            await user.save();

            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: 'Error al actualizar la contraseña' });
        }
    }

    // Eliminar usuario y su relación con comunidades
    async deleteUser(req, res) {
        try {
            await this.User.eliminarUsuario(req.params.id);
            await this.UserCommunity.eliminarRelacionesPorUsuario(req.params.id);
            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: 'Error al eliminar usuario' });
        }
    }

    // Mostrar perfil del usuario autenticado
    async getProfile(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.redirect('/login');
            }

            const user = await this.User.buscarPorId(userId);

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            res.render('profile', {
                user,
                usuario: {
                    nombre: req.session.nombre,
                    rol: req.session.rol,
                    comunidadId: req.session.comunidadId
                },
                currentPath: req.originalUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el perfil');
        }
    }
}

module.exports = UserController;