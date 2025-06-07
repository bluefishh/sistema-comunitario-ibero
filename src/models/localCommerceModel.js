const mongoose = require('mongoose');
const CommunityModel = require('./communitiesModel');

const localCommerceSchema = new mongoose.Schema({
    estado: String,          
    nombre_negocio: String,          
    direccion_negocio: String,
    descuento: String,
    fecha_vigencia: String,
    fecha_creacion: String,              
    descripcion: String,    
    publicador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },     
    comunidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
        required: true
    }
});

const LocalCommerce = mongoose.model('LocalCommerce', localCommerceSchema);

class LocalCommerceModel {
    // Obtener las ofertas por comunidad
    static async obtenerPorComunidad(comunidadId) {
        const filtro = { 
            comunidad: new mongoose.Types.ObjectId(comunidadId),
            estado: 'aprobada'
        };
        return await LocalCommerce.find(filtro).populate('publicador', 'primerNombre primerApellido');
    }

    // Obtener el nombre de la comunidad para una alerta
    static async obtenerNombreComunidad(comunidadId) {
        const comunidad = await CommunityModel.buscarPorId(comunidadId);
        return comunidad ? comunidad.nombre : '';
    }

    // Crear una nueva oferta
    static async crearOferta(data) {
        const nuevaOferta = new LocalCommerce({
            nombre_negocio: data.nombre_negocio,
            direccion_negocio: data.direccion_negocio,
            descuento: data.descuento,
            fecha_vigencia: data.fecha_vigencia,
            descripcion: data.descripcion,
            publicador: data.publicador,
            comunidad: data.comunidad,
            estado: 'pendiente',
            fecha_creacion: data.fecha_creacion
        });
        return await nuevaOferta.save();
    }

    // Obtener ofertas pendientes por comunidad
    static async obtenerOfertasPorComunidad(comunidadId) {
        const filtro = { 
            comunidad: new mongoose.Types.ObjectId(comunidadId)
        };
        return await LocalCommerce.find(filtro).populate('publicador', 'primerNombre primerApellido');
    }

    // Obtener una oferta por su ID
    static async obtenerPorId(ofertaId) {
        return await LocalCommerce.findById(ofertaId);
    }

    // Eliminar una oferta por su ID
    static async eliminarOferta(ofertaId) {
        return await LocalCommerce.findByIdAndDelete(ofertaId);
    }

    // Actualizar una oferta por su ID
    static async actualizarOferta(ofertaId, datos) {
        return await LocalCommerce.findByIdAndUpdate(ofertaId, datos, { new: true });
    }
}

module.exports = LocalCommerceModel;