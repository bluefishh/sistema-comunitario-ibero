const mongoose = require('mongoose');
const CommunityModel = require('./communitiesModel');

const alertSchema = new mongoose.Schema({
    estado: String,          
    titulo: String,          
    tipo: String,           
    descripcion: String,    
    publicador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },     
    fecha: String,   
    comunidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
        required: true
    }
});

const Alert = mongoose.model('Alert', alertSchema);

class AlertModel {
    // Obtener las alertas por comunidad
    static async obtenerPorComunidad(comunidadId) {
        const filtro = { 
            comunidad: new mongoose.Types.ObjectId(comunidadId),
            estado: 'aprobada'
         };
        return await Alert.find(filtro).populate('publicador', 'primerNombre primerApellido');
    }

    // Obtener el nombre de la comunidad para una alerta
    static async obtenerNombreComunidad(comunidadId) {
        const comunidad = await CommunityModel.buscarPorId(comunidadId);
        return comunidad ? comunidad.nombre : '';
    }

    // Crear una alerta
    static async crearAlerta({ titulo, descripcion, tipo, fecha, publicador, comunidad, estado = 'pendiente' }) {
        const nuevaAlerta = new Alert({
            titulo,
            descripcion,
            tipo,
            fecha,
            publicador,
            comunidad,
            estado
        });
        return await nuevaAlerta.save();
    }

    // Obtener alertas pendientes por comunidad
    static async obtenerAlertasPorComunidad(comunidadId) {
        const filtro = { 
            comunidad: new mongoose.Types.ObjectId(comunidadId)
        };
        return await Alert.find(filtro).sort({ fecha: -1 });
    }

    // Obtener una alerta por su ID
    static async obtenerPorId(alertaId) {
        return await Alert.findById(alertaId);
    }

    // Eliminar una alerta por su ID
    static async eliminarAlerta(alertaId) {
        return await Alert.findByIdAndDelete(alertaId);
    }

    // Actualizar una alerta por su ID
    static async actualizarAlerta(alertaId, datos) {
        return await Alert.findByIdAndUpdate(alertaId, datos, { new: true });
    }
}

module.exports = AlertModel;