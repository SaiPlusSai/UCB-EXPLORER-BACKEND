const model = require("../models/reminderModel");
const HttpError = require("../../../shared/utils/httpError");

const listarVisitante = (visitanteId) => model.porVisitante(visitanteId);
const listarAdmin = () => model.todosAdmin();

const crearVisitante = async (visitanteId, datos) => {
  if (!datos.titulo) throw new HttpError(400, "Titulo requerido");
  return model.crearVisitante({ ...datos, visitante_id: visitanteId });
};

const crearAdmin = async (adminId, datos) => {
  if (!datos.titulo) throw new HttpError(400, "Titulo requerido");
  return model.crearAdmin({ ...datos, admin_id: adminId });
};

const actualizar = async (id, datos, contexto) => {
  const r = await model.obtener(id);
  if (!r) throw new HttpError(404, "Recordatorio no encontrado");
  if (contexto.tipo === "visitante" && r.visitante_id !== contexto.id)
    throw new HttpError(403, "Sin acceso a este recordatorio");
  return model.actualizar(id, datos);
};

const eliminar = async (id, contexto) => {
  const r = await model.obtener(id);
  if (!r) throw new HttpError(404, "Recordatorio no encontrado");
  if (contexto.tipo === "visitante" && r.visitante_id !== contexto.id)
    throw new HttpError(403, "Sin acceso a este recordatorio");
  await model.eliminar(id);
};

module.exports = {
  listarVisitante,
  listarAdmin,
  crearVisitante,
  crearAdmin,
  actualizar,
  eliminar,
};
