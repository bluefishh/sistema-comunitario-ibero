const AlertModel = require('../models/alertModel');
const UserModel = require('../models/userModel');
const UserCommunity = require('../models/userCommunityModel');

const adminController = {
    // Obtener panel completo de administración
    async getAdminPanel(req, res) {
        try {
            const comunidadId = req.session.comunidadId;

            // Traer alertas pendientes SOLO de la comunidad seleccionada
            const alerts = comunidadId
                ? await AlertModel.obtenerAlertasPorComunidad(comunidadId)
                : [];
            for (const alert of alerts) {
                if (alert.publicador) {
                    const usuario = await UserModel.buscarPorId(alert.publicador);
                    alert.publicadorNombreCompleto = usuario
                        ? `${usuario.primerNombre} ${usuario.primerApellido}`
                        : 'Desconocido';
                } else {
                    alert.publicadorNombreCompleto = 'Desconocido';
                }
            }

            // Traer usuarios SOLO de la comunidad seleccionada usando UserCommunity
            let usuarios = [];
            if (comunidadId) {
                const userCommunities = await UserCommunity.buscarPorComunidad(comunidadId);
                const userIds = userCommunities.map(uc => uc.userId);
                const users = await UserModel.buscarPorIds(userIds);
                usuarios = users.map(user => ({
                    _id: user._id,
                    nombreCompleto: `${user.primerNombre} ${user.segundoNombre || ''} ${user.primerApellido} ${user.segundoApellido || ''}`.replace(/\s+/g, ' ').trim(),
                    correo: user.correo,
                    rol: user.rol
                }));
            }

            // Nombre de la comunidad
            let comunidadNombre = '';
            if (comunidadId && AlertModel.obtenerNombreComunidad) {
                comunidadNombre = await AlertModel.obtenerNombreComunidad(comunidadId);
            }

            res.render('administration', {
                alerts,
                usuarios,
                comunidad: comunidadNombre,
                usuario: { nombre: req.session.nombre, rol: req.session.rol },
                currentPath: req.originalUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el panel de administración');
        }
    }
};

module.exports = adminController;