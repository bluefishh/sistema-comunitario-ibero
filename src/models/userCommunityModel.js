const mongoose = require('mongoose');

const userCommunitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    dateUnion: { type: Date, default: Date.now }
});

const UserCommunity = mongoose.model('UserCommunity', userCommunitySchema);

class UserCommunityModel {
    // Eliminar relaciones por usuario
    static async eliminarRelacionesPorUsuario(userId) {
        return await UserCommunity.deleteMany({ userId });
    }

    // Buscar relaciones de comunidades por usuario
    static async buscarPorUsuario(userId) {
        return await UserCommunity.find({ userId }).populate('communityId');
    }

    // Buscar relaciones de usuarios por comunidad
    static async buscarPorComunidad(communityId) {
        return await UserCommunity.find({ communityId });
    }

    // Buscar relaciones de usuarios por comunidad y usuario
    static async existeRelacion(userId, communityId) {
        return await UserCommunity.findOne({ userId, communityId });
    }

    // Crear una nueva relación entre usuario y comunidad
    static async crearRelacion(userId, communityId) {
        return await UserCommunity.create({ userId, communityId });
    }
}

module.exports = UserCommunityModel;