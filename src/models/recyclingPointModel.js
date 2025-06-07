const mongoose = require('mongoose');
const CommunityModel = require('./communitiesModel');

const recyclingPointSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
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

const RecyclingPoint = mongoose.model('RecyclingPoint', recyclingPointSchema);

class RecyclingPointModel {
    // Obtener puntos por comunidad
    static async obtenerPuntosPorComunidad(comunidadId) {
        return await RecyclingPoint.find({ comunidad: new mongoose.Types.ObjectId(comunidadId) }).sort({ fecha_creacion: -1 });
    }

    // Obtener punto por ID
    static async obtenerPuntoPorId(id) {
        return await RecyclingPoint.findById(id);
    }

    // Crear un punto de reciclaje
    static async crearPunto({ nombre, direccion, comunidad, fecha_creacion }) {
        const nuevoPunto = new RecyclingPoint({
            nombre,
            direccion,
            comunidad,
            fecha_creacion
        });
        return await nuevoPunto.save();
    }

    // Actualizar un punto por su ID
    static async actualizarPunto(id, { nombre, direccion }) {
        return await RecyclingPoint.findByIdAndUpdate(
            id,
            { nombre, direccion },
            { new: true }
        );
    }

    // Eliminar un punto por su ID
    static async eliminarPunto(puntoId) {
        return await RecyclingPoint.findByIdAndDelete(puntoId);
    }
}

module.exports = RecyclingPointModel;