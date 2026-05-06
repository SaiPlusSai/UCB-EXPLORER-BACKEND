const model = require("../models/feedbackModel");
const HttpError = require("../../../shared/utils/httpError");

const listarVisitante = () => model.listarPreguntas({ soloActivas: true });
const listarAdmin = () => model.listarPreguntas();

const crearPregunta = (datos, adminId) => {
  if (!datos.pregunta) throw new HttpError(400, "Pregunta requerida");
  if (!datos.tipo_pregunta) throw new HttpError(400, "tipo_pregunta requerido");
  return model.crearPregunta({ ...datos, creado_por_admin_id: adminId });
};

const actualizarPregunta = async (id, datos) => {
  const r = await model.actualizarPregunta(id, datos);
  if (!r) throw new HttpError(404, "Pregunta no encontrada");
  return r;
};

const eliminarPregunta = (id) => model.eliminarPregunta(id);

const responder = async (visitanteId, respuestas) => {
  if (!Array.isArray(respuestas) || respuestas.length === 0)
    throw new HttpError(400, "Lista de respuestas requerida");
  const guardadas = [];
  for (const r of respuestas) {
    const pregunta = await model.obtenerPregunta(r.pregunta_id);
    if (!pregunta || !pregunta.activa) continue;
    const guardada = await model.registrarRespuesta({
      visitante_id: visitanteId,
      pregunta_id: r.pregunta_id,
      valor_rating: r.valor_rating,
      respuesta_texto: r.respuesta_texto,
    });
    guardadas.push(guardada);
  }
  return guardadas;
};

const respuestasPregunta = (id) => model.respuestasPorPregunta(id);
const todasRespuestas = () => model.todasLasRespuestas();

module.exports = {
  listarVisitante,
  listarAdmin,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  responder,
  respuestasPregunta,
  todasRespuestas,
};
