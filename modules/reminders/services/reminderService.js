const model = require("../models/reminderModel");

const HttpError = require("../../../shared/utils/httpError");

const listarVisitante = (visitanteId) =>
  model.porVisitante(visitanteId);

const crearVisitante = async (
  visitanteId,
  datos
) => {

  if (!datos.titulo) {

    throw new HttpError(
      400,
      "Titulo requerido"
    );
  }

  return model.crearVisitante({
    ...datos,
    visitante_id: visitanteId,
  });
};

const actualizar = async (
  id,
  datos,
  contexto
) => {

  const r = await model.obtener(id);

  if (!r) {

    throw new HttpError(
      404,
      "Recordatorio no encontrado"
    );
  }

  if (
    contexto.tipo === "visitante" &&
    r.visitante_id !== contexto.id
  ) {

    throw new HttpError(
      403,
      "Sin acceso a este recordatorio"
    );
  }

  return model.actualizar(id, datos);
};

const eliminar = async (
  id,
  contexto
) => {

  const r = await model.obtener(id);

  if (!r) {

    throw new HttpError(
      404,
      "Recordatorio no encontrado"
    );
  }

  if (
    contexto.tipo === "visitante" &&
    r.visitante_id !== contexto.id
  ) {

    throw new HttpError(
      403,
      "Sin acceso a este recordatorio"
    );
  }

  await model.eliminar(id);
};

const listarAdmin = () => model.todosAdmin();

const crearAdmin = async (datos) => {

  if (!datos.titulo?.trim()) {
    throw new HttpError(400, "Título requerido");
  }

  return model.crearAdmin(datos);
};

module.exports = {
  listarVisitante,
  crearVisitante,
  actualizar,
  eliminar,
  listarAdmin,
  crearAdmin,
};