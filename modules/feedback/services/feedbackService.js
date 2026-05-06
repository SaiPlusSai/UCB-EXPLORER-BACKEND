const model = require("../models/feedbackModel");

const HttpError = require("../../../shared/utils/httpError");

const listarVisitante = () =>
  model.listarPreguntas({
    soloActivas: true,
  });

const responder = async (
  visitanteId,
  respuestas
) => {

  if (
    !Array.isArray(respuestas) ||
    respuestas.length === 0
  ) {

    throw new HttpError(
      400,
      "Lista de respuestas requerida"
    );
  }

  const guardadas = [];

  for (const r of respuestas) {

    const pregunta =
      await model.obtenerPregunta(
        r.pregunta_id
      );

    if (
      !pregunta ||
      !pregunta.activa
    ) {

      continue;
    }

    const guardada =
      await model.registrarRespuesta({
        visitante_id: visitanteId,
        pregunta_id: r.pregunta_id,
        valor_rating: r.valor_rating,
        respuesta_texto:
          r.respuesta_texto,
      });

    guardadas.push(guardada);
  }

  return guardadas;
};

module.exports = {
  listarVisitante,
  responder,
};