const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  dia: String,
  horaInicio: String,
  horaFin: String,
  servicio: Boolean
});

const CampaniaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fecha: String,
  hora: String,
  lugar: String
});

const PuntoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String
});

const ResiduosSchema = new mongoose.Schema({
  comunidadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  horarios: [HorarioSchema],
  campanias: [CampaniaSchema],
  puntos: [PuntoSchema]
});

module.exports = mongoose.model('Residuos', ResiduosSchema);
