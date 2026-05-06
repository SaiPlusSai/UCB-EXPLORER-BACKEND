const preguntaModel = require("../models/preguntaModel");

const respuestaModel = require("../models/respuestaModel");

const visitanteModel = require("../../ticket-access-visitor/models/visitanteModel");

const HttpError = require("../../../shared/utils/httpError");

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

const responder = async (
  visitanteId,
  { pregunta_id, opcion_id }
) => {

  if (!pregunta_id || !opcion_id) {

    throw new HttpError(
      400,
      "pregunta_id y opcion_id requeridos"
    );
  }

  const pregunta = await preguntaModel.obtener(pregunta_id);

  if (!pregunta || !pregunta.activa) {

    throw new HttpError(
      404,
      "Pregunta no disponible"
    );
  }

  const opcion = await preguntaModel.opcionPertenece(
    opcion_id,
    pregunta_id
  );

  if (!opcion) {

    throw new HttpError(
      400,
      "Opcion no pertenece a la pregunta"
    );
  }

  const yaRespondida =
    await respuestaModel.yaRespondio(
      visitanteId,
      pregunta_id
    );

  if (yaRespondida) {

    throw new HttpError(
      409,
      "Ya respondiste esta pregunta"
    );
  }

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

    await visitanteModel.sumarPuntos(
      visitanteId,
      puntosOtorgados
    );
  }

  return {
    correcta,
    puntos_otorgados: puntosOtorgados,
    mensaje_feedback: pregunta.mensaje_feedback,
  };
};

const historial = (visitanteId) =>
  respuestaModel.respondidasPor(visitanteId);

module.exports = {
  listarParaVisitante,
  responder,
  historial,
};