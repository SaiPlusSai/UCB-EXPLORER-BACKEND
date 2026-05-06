const service = require("../services/visitorAccessService");

exports.acceso = async (req, res) => {
  const data = await service.accesoSimplificado(req.body);
  res.json({ ok: true, data });
};

exports.me = async (req, res) => {
  const data = await service.obtenerPerfil(req.visitante.id);
  res.json({ ok: true, data });
};
