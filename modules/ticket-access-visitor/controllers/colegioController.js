const colegioModel = require("../models/colegioModel");

exports.listar = async (req, res) => {
  const data = await colegioModel.listar();
  res.json({ ok: true, data });
};

exports.crear = async (req, res) => {
  const data = await colegioModel.crear({
    nombre: req.body.nombre,
    adminId: req.admin?.id,
  });
  res.status(201).json({ ok: true, data });
};

exports.actualizar = async (req, res) => {
  const data = await colegioModel.actualizar(req.params.id, req.body);
  res.json({ ok: true, data });
};

exports.eliminar = async (req, res) => {
  await colegioModel.eliminar(req.params.id);
  res.json({ ok: true, mensaje: "Colegio eliminado" });
};
