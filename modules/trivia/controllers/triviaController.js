const service = require("../services/triviaService");

exports.listarAdmin = async (req, res) => {
  const data = await service.listarParaAdmin({
    carrera_id: req.query.carrera_id ? Number(req.query.carrera_id) : null,
  });
  res.json({ ok: true, data });
};

exports.listarVisitante = async (req, res) => {
  const data = await service.listarParaVisitante({
    carrera_id: req.query.carrera_id ? Number(req.query.carrera_id) : null,
  });
  res.json({ ok: true, data });
};

exports.obtenerAdmin = async (req, res) => {
  const data = await service.obtenerParaAdmin(req.params.id);
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
  res.json({ ok: true, mensaje: "Pregunta eliminada" });
};

exports.responder = async (req, res) => {
  const data = await service.responder(req.visitante.id, req.body);
  res.json({ ok: true, data });
};

exports.historial = async (req, res) => {
  const data = await service.historial(req.visitante.id);
  res.json({ ok: true, data });
};
