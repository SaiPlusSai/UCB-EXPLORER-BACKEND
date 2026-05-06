const service = require("../services/qrService");

exports.escanear = async (req, res) => {
  const data = await service.escanear(req.visitante.id, req.body);
  res.json({ ok: true, data });
};

exports.historial = async (req, res) => {
  res.json({ ok: true, data: await service.historialVisitante(req.visitante.id) });
};

exports.adminTodos = async (req, res) => {
  res.json({ ok: true, data: await service.todosEscaneosAdmin() });
};
