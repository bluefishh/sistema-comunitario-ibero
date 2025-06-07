const UserCommunityModel = require('../models/userCommunityModel');
const CommunityModel = require('../models/communitiesModel');

class CommunityController {
    constructor(communityModel) {
        this.communityModel = communityModel;
    }

    // Obtener todas las comunidades
    async getAllCommunities(req, res) {
        try {
            const communities = await this.communityModel.obtenerTodas();

            // Obtener el ID del usuario desde la sesión
            const userId = req.session.userId;

            // Busca las comunidades a las que el usuario está unido
            let misComunidades = [];
            if (userId) {
                const userCommunities = await UserCommunityModel.buscarPorUsuario(userId);
                misComunidades = userCommunities.map(uc => uc.communityId);
            }

            res.render('communities', {
                idUsuario: { id: req.session.userId },
                usuario: { nombre: req.session.nombre },
                misComunidades: misComunidades
            });
        } catch (error) {
            res.status(500).send('Error al obtener las comunidades');
        }
    }
}

// Unirse a una comunidad
async function joinCommunity(req, res) {
    try {
        const { apiId, nombre, ciudad, estado, codigoPostal } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        // Usa el modelo, no Mongoose directamente
        let community = await CommunityModel.buscarPorApiId(apiId);
        if (!community) {
            community = await CommunityModel.crearComunidad({ apiId, nombre, ciudad, estado, codigoPostal });
        }

        const exists = await UserCommunityModel.existeRelacion(userId, community._id);
        if (exists) {
            return res.status(200).json({ message: 'Ya eres miembro de esta comunidad.' });
        }

        await UserCommunityModel.crearRelacion(userId, community._id);
        res.status(201).json({ message: 'Unido a la comunidad exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

module.exports = {
    CommunityController,
    joinCommunity
};