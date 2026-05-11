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

const listarAdmin = () =>
  model.listarPreguntas({ soloActivas: false });

const crearPregunta = async (datos) => {

  if (!datos.pregunta?.trim()) {
    throw new HttpError(400, "Campo pregunta requerido");
  }

  return model.crearPregunta(datos);
};

const actualizarPregunta = async (id, datos) => {

  const existe = await model.obtenerPregunta(id);

  if (!existe) throw new HttpError(404, "Pregunta no encontrada");

  return model.actualizarPregunta(id, datos);
};

const eliminarPregunta = async (id) => {

  const existe = await model.obtenerPregunta(id);

  if (!existe) throw new HttpError(404, "Pregunta no encontrada");

  await model.eliminarPregunta(id);
};

const respuestasPregunta = (id) =>
  model.respuestasPorPregunta(id);

const todasRespuestas = () =>
  model.todasLasRespuestas();

const misRespuestas = (
  visitanteId
) =>
  model.respuestasPorVisitante(
    visitanteId
  );
module.exports = {
  listarVisitante,
  responder,
  listarAdmin,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  respuestasPregunta,
  todasRespuestas,
  misRespuestas,
};