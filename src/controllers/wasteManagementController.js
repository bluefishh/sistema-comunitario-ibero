const CampaignModel = require('../models/campaignModel');
const RecyclingPointModel = require('../models/recyclingPointModel');
const CollectionScheduleModel = require('../models/scheduleModel');

class WasteManagementController {
    // Renderizar la página principal de gestión de residuos
    async getWasteManagementPage(req, res) {
        try {
            const comunidadId = req.session.comunidadId;
            const usuarioNombre = req.session.nombre || '';
            const usuarioRol = req.session.rol || '';

            const campaigns = comunidadId
                ? await CampaignModel.obtenerPorComunidad(comunidadId)
                : [];

            const comunidadNombre = comunidadId
                ? await CampaignModel.obtenerNombreComunidad(comunidadId)
                : '';

            // Obtener el horario de la comunidad
            let schedule = comunidadId
                ? await CollectionScheduleModel.obtenerHorarioPorComunidad(comunidadId)
                : null;

            // Si no existe, lo crea automáticamente con todos los días en "Pendiente"
            if (!schedule && comunidadId) {
                await CollectionScheduleModel.crearHorarioSemana({ comunidadId });
                schedule = await CollectionScheduleModel.obtenerHorarioPorComunidad(comunidadId);
            }

            const points = comunidadId
                ? await RecyclingPointModel.obtenerPuntosPorComunidad(comunidadId)
                : [];

            res.render('wasteManagement', {
                campaigns,
                comunidad: comunidadNombre,
                usuario: {
                    nombre: usuarioNombre,
                    rol: usuarioRol,
                    comunidadId: req.session.comunidadId
                },
                schedule,
                points,
                currentPath: req.originalUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: 'Error al cargar la gestión de residuos', details: error.message });
        }
    }

    // Crear una nueva campaña de reciclaje
    async createCampaign(req, res) {
        try {
            const { nombre, descripcion, fecha_campannia, hora, lugar, comunidad } = req.body;

            await CampaignModel.crearCampaña({
                nombre,
                descripcion,
                fecha_campannia,
                hora,
                lugar,
                comunidad,
                fecha_creacion: new Date()
            });

            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: true });
            }
            res.redirect('/wastemanagement');
        } catch (error) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: false, message: error.message });
            }
            res.status(500).render('error', { error: 'Error al crear la campaña', details: error.message });
        }
    }

    // Obtener datos de una campaña (para ver o editar)
    async getCampaign(req, res) {
        try {
            const { id } = req.params;
            const campania = await CampaignModel.obtenerCampaniaPorId(id);
            if (!campania) {
                return res.status(404).json({ success: false, message: 'Campaña no encontrada' });
            }
            res.json(campania);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Actualizar campaña de reciclaje
    async updateCampaign(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, fecha_campannia, hora, lugar } = req.body;
            await CampaignModel.actualizarCampania(id, {
                nombre,
                descripcion,
                fecha_campannia,
                hora,
                lugar
            });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Eliminar campaña de reciclaje
    async deleteCampaign(req, res) {
        try {
            const { id } = req.params;
            await CampaignModel.eliminarCampaña(id);
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    }

    // Aprobar campaña
    async approveCampaign(req, res) {
        try {
            const { id } = req.params;
            await CampaignModel.actualizarCampania(id, { estado: 'aprobada' });
            return res.json({ success: true });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }

    // Rechazar campaña
    async rejectCampaign(req, res) {
        try {
            const { id } = req.params;
            await CampaignModel.actualizarCampania(id, { estado: 'rechazada' });
            return res.json({ success: true });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }

    // Actualizar horario para un día específico
    async updateScheduleDay(req, res) {
        try {
            const { comunidadId, dia, horario } = req.body;
            await CollectionScheduleModel.actualizarHorarioDia({
                comunidadId,
                dia,
                horario
            });
            return res.json({ success: true });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }

    // Obtener datos de un punto de recolección
    async getCollectionPoint(req, res) {
        try {
            const { id } = req.params;
            const punto = await RecyclingPointModel.obtenerPuntoPorId(id);
            if (!punto) {
                return res.status(404).json({ success: false, message: 'Punto no encontrado' });
            }
            res.json(punto);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Crear un nuevo punto de recolección
    async createCollectionPoint(req, res) {
        try {
            const { nombre, direccion, comunidad } = req.body;
            await RecyclingPointModel.crearPunto({
                nombre,
                direccion,
                comunidad,
                fecha_creacion: new Date()
            });
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: true });
            }
            res.redirect('/wastemanagement');
        } catch (error) {
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: false, message: error.message });
            }
            res.status(500).render('error', { error: 'Error al crear el punto de recolección', details: error.message });
        }
    }

    // Actualizar punto de recolección
    async updateCollectionPoint(req, res) {
        try {
            const { id } = req.params;
            const { nombre, direccion } = req.body;
            await RecyclingPointModel.actualizarPunto(id, { nombre, direccion });
            return res.json({ success: true });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }

    // Eliminar punto de recolección
    async deleteCollectionPoint(req, res) {
        try {
            const { id } = req.params;
            await RecyclingPointModel.eliminarPunto(id);
            res.json({ success: true });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    }
}

module.exports = WasteManagementController;