const mongoose = require('mongoose');
const CommunityModel = require('./communitiesModel');

const scheduleSchema = new mongoose.Schema({
    comunidadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
        required: true,
        unique: true
    },
    lunes:    { type: String, default: 'Pendiente' },
    martes:   { type: String, default: 'Pendiente' },
    miercoles:{ type: String, default: 'Pendiente' },
    jueves:   { type: String, default: 'Pendiente' },
    viernes:  { type: String, default: 'Pendiente' },
    sabado:   { type: String, default: 'Pendiente' },
    domingo:  { type: String, default: 'Pendiente' }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

class ScheduleModel {
    // Obtener el horario de la comunidad
    static async obtenerHorarioPorComunidad(comunidadId) {
        return await Schedule.findOne({ comunidadId: new mongoose.Types.ObjectId(comunidadId) });
    }

    // Crear el horario semanal (solo si no existe)
    static async crearHorarioSemana({ comunidadId }) {
        const existente = await Schedule.findOne({ comunidadId: new mongoose.Types.ObjectId(comunidadId) });
        if (existente) return existente;
        const nuevoHorario = new Schedule({ comunidadId });
        return await nuevoHorario.save();
    }

    // Actualizar el horario de un día específico
    static async actualizarHorarioDia({ comunidadId, dia, horario }) {
        // dia debe ser el nombre del campo: 'lunes', 'martes', etc.
        const update = {};
        update[dia] = horario;
        return await Schedule.findOneAndUpdate(
            { comunidadId: new mongoose.Types.ObjectId(comunidadId) },
            { $set: update },
            { new: true }
        );
    }
}

module.exports = ScheduleModel;