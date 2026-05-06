const service = require("../services/rewardsService");

exports.listarVisitante = async (req, res) => {
  res.json({ ok: true, data: await service.listarParaVisitante() });
};

exports.listarAdmin = async (req, res) => {
  res.json({ ok: true, data: await service.listarParaAdmin() });
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
  res.json({ ok: true, mensaje: "Premio eliminado" });
};

exports.canjear = async (req, res) => {
  const data = await service.canjear(req.visitante.id, Number(req.params.id));
  res.json({ ok: true, data });
};

exports.historial = async (req, res) => {
  res.json({ ok: true, data: await service.historialVisitante(req.visitante.id) });
};

exports.todosCanjes = async (req, res) => {
  res.json({ ok: true, data: await service.todosLosCanjes() });
};
