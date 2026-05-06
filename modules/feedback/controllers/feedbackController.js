const service = require("../services/feedbackService");

exports.listarVisitante = async (req, res) => {
  res.json({ ok: true, data: await service.listarVisitante() });
};

exports.listarAdmin = async (req, res) => {
  res.json({ ok: true, data: await service.listarAdmin() });
};

exports.crear = async (req, res) => {
  const data = await service.crearPregunta(req.body, req.admin?.id);
  res.status(201).json({ ok: true, data });
};

exports.actualizar = async (req, res) => {
  const data = await service.actualizarPregunta(req.params.id, req.body);
  res.json({ ok: true, data });
};

exports.eliminar = async (req, res) => {
  await service.eliminarPregunta(req.params.id);
  res.json({ ok: true, mensaje: "Pregunta eliminada" });
};

exports.responder = async (req, res) => {
  const data = await service.responder(req.visitante.id, req.body.respuestas);
  res.json({ ok: true, data });
};

exports.respuestasPregunta = async (req, res) => {
  const data = await service.respuestasPregunta(req.params.id);
  res.json({ ok: true, data });
};

exports.todasRespuestas = async (req, res) => {
  res.json({ ok: true, data: await service.todasRespuestas() });
};
