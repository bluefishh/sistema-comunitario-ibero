const mongoose = require('mongoose');
const CommunityModel = require('./communitiesModel');

const campaignSchema = new mongoose.Schema({
    estado: {
        type: String,
        default: 'pendiente'
    },
    nombre: String,
    descripcion: String,
    fecha_campannia: Date,
    hora: String,
    lugar: String,
    comunidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
        required: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

class CampaignModel {
    // Obtener campañas por comunidad
    static async obtenerPorComunidad(comunidadId) {
        return await Campaign.find({
            comunidad: new mongoose.Types.ObjectId(comunidadId),
            estado: 'aprobada'
        }).sort({ fecha_campannia: -1 });
    }

    // Obtener TODAS las campañas por comunidad
    static async obtenerCampañasPorComunidad(comunidadId) {
        return await Campaign.find({
            comunidad: new mongoose.Types.ObjectId(comunidadId)
        }).sort({ fecha_campannia: -1 });
    }

    // Obtener el nombre de la comunidad para una campaña
    static async obtenerNombreComunidad(comunidadId) {
        const comunidad = await CommunityModel.buscarPorId(comunidadId);
        return comunidad ? comunidad.nombre : '';
    }

    // Obtener campaña por ID
    static async obtenerCampaniaPorId(id) {
        return await Campaign.findById(id);
    }

    // Crear una campaña
    static async crearCampaña({ nombre, descripcion, fecha_campannia, hora, lugar, comunidad, fecha_creacion, estado = 'pendiente' }) {
        const nuevaCampaña = new Campaign({
            nombre,
            descripcion,
            fecha_campannia,
            hora,
            lugar,
            comunidad,
            fecha_creacion,
            estado
        });
        return await nuevaCampaña.save();
    }

    // Actualizar una campaña por su ID
    static async actualizarCampania(id, datos) {
        return await Campaign.findByIdAndUpdate(id, datos, { new: true });
    }

    // Eliminar una campaña por su ID
    static async eliminarCampaña(campañaId) {
        return await Campaign.findByIdAndDelete(campañaId);
    }
}

module.exports = CampaignModel;