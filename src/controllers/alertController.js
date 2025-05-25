class AlertController {
    constructor(alertModel) {
        this.alertModel = alertModel;
    }

    // Obtener alertas por comunidad
    async getAlertsByCommunity(req, res) {
        try {
            const comunidadId = req.params.comunidadId;
            const usuarioNombre = req.usuarioNombre || '';
            const alerts = comunidadId
                ? await this.alertModel.obtenerPorComunidad(comunidadId)
                : [];
            
            const comunidadNombre = comunidadId
                ? await this.alertModel.obtenerNombreComunidad(comunidadId)
                : '';

            alerts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            res.render('alerts', {
                alerts,
                comunidad: comunidadNombre,
                usuario: { 
                    nombre: usuarioNombre,
                    rol: req.session.rol
                },
                currentPath: req.originalUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener alertas por comunidad');
        }
    }

    // Crear nueva alerta
    async createAlert(req, res) {
        try {
            const { titulo, descripcion, tipo, publicador, comunidad } = req.body;

            const nuevaAlerta = await this.alertModel.crearAlerta({
                titulo,
                descripcion,
                tipo,
                fecha: new Date(),
                publicador,
                comunidad
            });

            res.json({ success: true, alert: nuevaAlerta });
        } catch (error) {
            console.error(error);
            res.json({ success: false, message: error.message });
        }
    }

    
    // Eliminar alerta por id
    async deleteAlert(req, res) {
        try {
            const { id } = req.params;
            console.log("ID ALERTA A BORRAR CONTROLLER: " + id);
            await this.alertModel.eliminarAlerta(id);
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al eliminar la alerta' });
        }
    }

    // Obtener alerta por id
    async getAlertById(req, res) {
        try {
            const { id } = req.params;
            const alerta = await this.alertModel.obtenerPorId(id);
            if (!alerta) {
                return res.status(404).json({});
            }
            res.json(alerta);
        } catch (error) {
            res.status(404).json({});
        }
    }

    // Actualizar alerta por id
    async updateAlert(req, res) {
        try {
            const { id } = req.params;
            const { titulo, descripcion, tipo } = req.body;
            await this.alertModel.actualizarAlerta(id, { titulo, descripcion, tipo });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al actualizar la alerta' });
        }
    }
    
    // Aprobar alerta por id
    async approveAlert(req, res) {
        try {
            const { id } = req.params;
            await this.alertModel.actualizarAlerta(id, { estado: 'aprobada' });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al aprobar la alerta' });
        }
    }

    // Rechazar alerta por id
    async rejectAlert(req, res) {
        try {
            const { id } = req.params;
            await this.alertModel.actualizarAlerta(id, { estado: 'rechazada' });
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: 'Error al rechazar la alerta' });
        }
    }
}

module.exports = AlertController;