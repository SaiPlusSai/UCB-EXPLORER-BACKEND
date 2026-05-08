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

const listarParaAdmin = () => premioModel.listar();

const crear = async (datos) => {

  if (!datos.nombre?.trim()) {
    throw new HttpError(400, "Nombre requerido");
  }

  return premioModel.crear(datos);
};

const actualizar = async (id, datos) => {

  const existe = await premioModel.obtener(id);

  if (!existe) throw new HttpError(404, "Premio no encontrado");

  return premioModel.actualizar(id, datos);
};

const eliminar = async (id) => {

  const existe = await premioModel.obtener(id);

  if (!existe) throw new HttpError(404, "Premio no encontrado");

  await premioModel.eliminar(id);
};

const todosLosCanjes = () => canjeModel.todos();

module.exports = {
  listarParaVisitante,
  canjear,
  historialVisitante,
  listarParaAdmin,
  crear,
  actualizar,
  eliminar,
  todosLosCanjes,
};