const carreraModel = require("../models/carreraModel");
const HttpError = require("../../../shared/utils/httpError");

const listar = (opts) => carreraModel.listar(opts);

const obtener = async (id) => {
  const carrera = await carreraModel.obtener(id);
  if (!carrera) throw new HttpError(404, "Carrera no encontrada");
  return carrera;
};

const crear = async ({ nombre, descripcion }, adminId) => {
  if (!nombre || !nombre.trim()) throw new HttpError(400, "Nombre requerido");
  return carreraModel.crear({
    nombre: nombre.trim(),
    descripcion: descripcion || null,
    creado_por_admin_id: adminId,
  });
};

const actualizar = async (id, datos) => {
  const updated = await carreraModel.actualizar(id, datos);
  if (!updated) throw new HttpError(404, "Carrera no encontrada");
  return updated;
};

const eliminar = (id) => carreraModel.eliminar(id);

module.exports = { listar, obtener, crear, actualizar, eliminar };
