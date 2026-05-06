const premioModel = require("../models/premioModel");

const canjeModel = require("../models/canjeModel");

const visitanteModel = require("../../ticket-access-visitor/models/visitanteModel");

const HttpError = require("../../../shared/utils/httpError");

const listarParaVisitante = () =>
  premioModel.listar({
    soloActivos: true,
  });

const canjear = async (
  visitanteId,
  premioId
) => {

  const premio =
    await premioModel.obtener(premioId);

  if (!premio || !premio.activo) {

    throw new HttpError(
      404,
      "Premio no disponible"
    );
  }

  if (premio.stock <= 0) {

    throw new HttpError(
      409,
      "Sin stock disponible"
    );
  }

  const visitante =
    await visitanteModel.obtener(
      visitanteId
    );

  if (!visitante) {

    throw new HttpError(
      404,
      "Visitante no encontrado"
    );
  }

  if (
    visitante.puntos_totales <
    premio.costo_puntos
  ) {

    throw new HttpError(
      400,
      "Puntos insuficientes"
    );
  }

  const decremento =
    await premioModel.decrementarStock(
      premioId
    );

  if (!decremento) {

    throw new HttpError(
      409,
      "No se pudo reservar el premio"
    );
  }

  await visitanteModel.restarPuntos(
    visitanteId,
    premio.costo_puntos
  );

  const canje =
    await canjeModel.registrar({
      visitante_id: visitanteId,
      premio_id: premioId,
    });

  return {
    canje,
    premio,

    puntos_restantes: Math.max(
      visitante.puntos_totales -
        premio.costo_puntos,
      0
    ),
  };
};

const historialVisitante = (
  visitanteId
) =>
  canjeModel.porVisitante(
    visitanteId
  );

module.exports = {
  listarParaVisitante,
  canjear,
  historialVisitante,
};