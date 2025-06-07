class LocalCommerceController {
    constructor(localCommerceModel) {
        this.localCommerceModel = localCommerceModel;
    }

    // Obtener ofertas por comunidad
    async getOffersByCommunity(req, res) {
        try {
            const comunidadId = req.params.comunidadId || req.session.comunidadId;
            const usuarioNombre = req.session.nombre || '';
            const usuarioRol = req.session.rol || '';

            const offers = comunidadId
                ? await this.localCommerceModel.obtenerPorComunidad(comunidadId)
                : [];
                
            const comunidadNombre = comunidadId
                ? await this.localCommerceModel.obtenerNombreComunidad(comunidadId)
                : '';

            res.render('localcommerce', {
                offers,
                comunidad: comunidadNombre,
                usuario: {
                    nombre: usuarioNombre,
                    rol: usuarioRol
                },
                currentPath: req.originalUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: 'Error al obtener las ofertas por comunidad', details: error.message });
        }
    }

    // Crear una nueva oferta
    async createOffer(req, res) {
        try {
            const { nombre_negocio, direccion_negocio, descuento, fecha_vigencia, descripcion, publicador, comunidad } = req.body;

            const nuevaOferta = await this.localCommerceModel.crearOferta({
                nombre_negocio,
                direccion_negocio,
                descuento,
                fecha_vigencia,
                descripcion,
                publicador,
                comunidad,
                fecha_creacion: new Date()
            });

            res.json({ success: true, oferta: nuevaOferta });
        } catch (error) {
            console.error(error);
            res.json({ success: false, message: error.message });
        }
    }

    async deleteOffer(req, res) {
        try {
            const { id } = req.params;
            await this.localCommerceModel.eliminarOferta(id);
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al eliminar la oferta' });
        }
    }

    // Obtener oferta por id
    async getOfferById(req, res) {
        try {
            const { id } = req.params;
            const oferta = await this.localCommerceModel.obtenerPorId(id);
            if (!oferta) {
                return res.status(404).json({});
            }
            res.json(oferta);
        } catch (error) {
            res.status(404).json({});
        }
    }

    // Actualizar oferta por id
    async updateOffer(req, res) {
        try {
            const { id } = req.params;
            const { nombre_negocio, direccion_negocio, descuento, fecha_vigencia, descripcion } = req.body;
            await this.localCommerceModel.actualizarOferta(id, { nombre_negocio, direccion_negocio, descuento, fecha_vigencia, descripcion });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al actualizar la oferta' });
        }
    }

    // Aprobar oferta por id
    async approveOffer(req, res) {
        try {
            const { id } = req.params;
            await this.localCommerceModel.actualizarOferta(id, { estado: 'aprobada' });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al aprobar la oferta' });
        }
    }

    // Rechazar oferta por id
    async rejectOffer(req, res) {
        try {
            const { id } = req.params;
            await this.localCommerceModel.actualizarOferta(id, { estado: 'rechazada' });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al rechazar la oferta' });
        }
    }
}

module.exports = LocalCommerceController;