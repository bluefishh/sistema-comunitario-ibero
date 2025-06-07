const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    ciudad: { type: String },
    estado: { type: String },
    codigoPostal: { type: String },
    apiId: { type: String, unique: true },
    fechaCreacion: { type: Date, default: Date.now }
});

const Community = mongoose.model('Community', communitySchema);

class CommunityModel {
    // Obtener todas las comunidades
    static async obtenerTodas() {
        return await Community.find({});
    }

    // Buscar comunidad por apiId
    static async buscarPorApiId(apiId) {
        return await Community.findOne({ apiId });
    }

    // Crear una nueva comunidad
    static async crearComunidad(data) {
        const comunidad = new Community(data);
        return await comunidad.save();
    }

    // Buscar comunidad por ID
    static async buscarPorId(id) {
        return await Community.findById(id);
    }
}

module.exports = CommunityModel;