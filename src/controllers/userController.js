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
}

module.exports = UserController;