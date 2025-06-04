const Residuos = require('../models/residuo.model');
const UserCommunityModel = require('../models/userCommunityModel');

// Utilidad para obtener comunidad del usuario actual
const getComunidadUsuario = async (userId) => {
  const relaciones = await UserCommunityModel.buscarPorUsuario(userId);
  return relaciones.length > 0 ? relaciones[0].communityId : null;
};

// Obtener panel
const getPanelResiduos = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).send('Usuario no autenticado');

    const comunidad = await getComunidadUsuario(userId);
    if (!comunidad) return res.status(400).send('Sin comunidad asociada');

    let residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    if (!residuos) {
      residuos = new Residuos({
        comunidadId: comunidad._id,
        horarios: [],
        campanias: [],
        puntos: []
      });
      await residuos.save();
    }

    res.render('residuos', {
      residuos,
      usuario: req.session.user,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error al cargar residuos:', error);
    res.status(500).send('Error interno del servidor');
  }
};

// ===================== CAMPAÑAS =====================
const crearCampania = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, lugar } = req.body;
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    if (!comunidad) return res.status(400).send('Sin comunidad');

    let residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    if (!residuos) {
      residuos = new Residuos({ comunidadId: comunidad._id, horarios: [], campanias: [], puntos: [] });
    }

    residuos.campanias.push({ titulo, descripcion, fecha, hora, lugar });
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al crear campaña:', error);
    res.status(500).send('Error interno al crear campaña');
  }
};

const eliminarCampania = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    residuos.campanias = residuos.campanias.filter(c => c._id.toString() !== req.params.id);
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al eliminar campaña:', error);
    res.status(500).send('Error interno');
  }
};

const editarCampania = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    const c = residuos.campanias.id(req.params.id);

    Object.assign(c, req.body);
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al editar campaña:', error);
    res.status(500).send('Error interno');
  }
};

// ===================== HORARIOS =====================
const crearHorario = async (req, res) => {
  try {
    const { dia, horaInicio, horaFin, servicio } = req.body;
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    if (!comunidad) return res.status(400).send('Sin comunidad');

    let residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    if (!residuos) residuos = new Residuos({ comunidadId: comunidad._id, horarios: [], campanias: [], puntos: [] });

    residuos.horarios.push({ dia, horaInicio, horaFin, servicio: servicio === 'true' });
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).send('Error al crear horario');
  }
};

const editarHorario = async (req, res) => {
  try {
    const { dia, horaInicio, horaFin, servicio } = req.body;
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    const h = residuos.horarios.id(req.params.id);

    h.dia = dia;
    h.horaInicio = horaInicio;
    h.horaFin = horaFin;
    h.servicio = servicio === 'true';

    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al editar horario:', error);
    res.status(500).send('Error interno');
  }
};

const eliminarHorario = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    residuos.horarios = residuos.horarios.filter(h => h._id.toString() !== req.params.id);
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).send('Error interno');
  }
};

// ===================== PUNTOS DE RECICLAJE =====================
const crearPunto = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    if (!comunidad) return res.status(400).send('Sin comunidad');

    let residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    if (!residuos) residuos = new Residuos({ comunidadId: comunidad._id, horarios: [], campanias: [], puntos: [] });

    residuos.puntos.push({ nombre, descripcion });
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al crear punto:', error);
    res.status(500).send('Error interno');
  }
};

const editarPunto = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    const punto = residuos.puntos.id(req.params.id);
    punto.nombre = nombre;
    punto.descripcion = descripcion;
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al editar punto:', error);
    res.status(500).send('Error interno');
  }
};

const eliminarPunto = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const comunidad = await getComunidadUsuario(userId);
    const residuos = await Residuos.findOne({ comunidadId: comunidad._id });
    residuos.puntos = residuos.puntos.filter(p => p._id.toString() !== req.params.id);
    await residuos.save();
    res.redirect('/residuos');
  } catch (error) {
    console.error('Error al eliminar punto:', error);
    res.status(500).send('Error interno');
  }
};

// ===================== EXPORTAR =====================
module.exports = {
  getPanelResiduos,
  crearCampania,
  eliminarCampania,
  editarCampania,
  crearHorario,
  editarHorario,
  eliminarHorario,
  crearPunto,
  editarPunto,
  eliminarPunto
};

