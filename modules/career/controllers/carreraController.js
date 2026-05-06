const service = require("../services/carreraService");

exports.listar = async (req, res) => {
  const soloActivas = req.query.activas === "1" || req.query.activas === "true";
  const data = await service.listar({ soloActivas });
  res.json({ ok: true, data });
};

exports.obtener = async (req, res) => {
  const data = await service.obtener(req.params.id);
  res.json({ ok: true, data });
};

exports.crear = async (req, res) => {
  const data = await service.crear(req.body, req.admin?.id);
  res.status(201).json({ ok: true, data });
};

exports.actualizar = async (req, res) => {
  const data = await service.actualizar(req.params.id, req.body);
  res.json({ ok: true, data });
};

exports.eliminar = async (req, res) => {
  await service.eliminar(req.params.id);
  res.json({ ok: true, mensaje: "Carrera eliminada" });
};
