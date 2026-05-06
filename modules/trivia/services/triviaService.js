const preguntaModel = require("../models/preguntaModel");
const respuestaModel = require("../models/respuestaModel");
const visitanteModel = require("../../ticket-access-visitor/models/visitanteModel");
const HttpError = require("../../../shared/utils/httpError");

const listarParaAdmin = (filtros) => preguntaModel.listarConOpciones(filtros);

const listarParaVisitante = async (filtros) => {
  const preguntas = await preguntaModel.listarConOpciones({
    ...filtros,
    soloActivas: true,
  });
  return preguntas.map((p) => ({
    ...p,
    opciones: p.opciones.map((o) => ({
      id: o.id,
      texto_opcion: o.texto_opcion,
    })),
  }));
};

const obtenerParaAdmin = async (id) => {
  const data = await preguntaModel.obtenerConOpciones(id);
  if (!data) throw new HttpError(404, "Pregunta no encontrada");
  return data;
};

const crear = async (datos, adminId) => {
  if (!datos.pregunta || !datos.pregunta.trim())
    throw new HttpError(400, "Pregunta requerida");
  const opciones = Array.isArray(datos.opciones) ? datos.opciones : [];
  if (opciones.length < 2)
    throw new HttpError(400, "Se requieren al menos 2 opciones");
  if (!opciones.some((o) => o.es_correcta))
    throw new HttpError(400, "Debe haber al menos una opcion correcta");

  const pregunta = await preguntaModel.crear({
    ...datos,
    creado_por_admin_id: adminId,
  });
  await preguntaModel.reemplazarOpciones(pregunta.id, opciones);
  return preguntaModel.obtenerConOpciones(pregunta.id);
};

const actualizar = async (id, datos) => {
  const updated = await preguntaModel.actualizar(id, datos);
  if (!updated) throw new HttpError(404, "Pregunta no encontrada");
  if (Array.isArray(datos.opciones) && datos.opciones.length > 0) {
    if (!datos.opciones.some((o) => o.es_correcta))
      throw new HttpError(400, "Debe haber al menos una opcion correcta");
    await preguntaModel.reemplazarOpciones(id, datos.opciones);
  }
  return preguntaModel.obtenerConOpciones(id);
};

const eliminar = (id) => preguntaModel.eliminar(id);

const responder = async (visitanteId, { pregunta_id, opcion_id }) => {
  if (!pregunta_id || !opcion_id)
    throw new HttpError(400, "pregunta_id y opcion_id requeridos");

  const pregunta = await preguntaModel.obtener(pregunta_id);
  if (!pregunta || !pregunta.activa)
    throw new HttpError(404, "Pregunta no disponible");

  const opcion = await preguntaModel.opcionPertenece(opcion_id, pregunta_id);
  if (!opcion) throw new HttpError(400, "Opcion no pertenece a la pregunta");

  const yaRespondida = await respuestaModel.yaRespondio(visitanteId, pregunta_id);
  if (yaRespondida) throw new HttpError(409, "Ya respondiste esta pregunta");

  const correcta = !!opcion.es_correcta;
  await respuestaModel.registrar({
    visitante_id: visitanteId,
    pregunta_id,
    opcion_seleccionada_id: opcion_id,
    correcta,
  });

  let puntosOtorgados = 0;
  if (correcta) {
    puntosOtorgados = pregunta.puntos || 0;
    await visitanteModel.sumarPuntos(visitanteId, puntosOtorgados);
  }

  return {
    correcta,
    puntos_otorgados: puntosOtorgados,
    mensaje_feedback: pregunta.mensaje_feedback,
  };
};

const historial = (visitanteId) => respuestaModel.respondidasPor(visitanteId);

module.exports = {
  listarParaAdmin,
  listarParaVisitante,
  obtenerParaAdmin,
  crear,
  actualizar,
  eliminar,
  responder,
  historial,
};
