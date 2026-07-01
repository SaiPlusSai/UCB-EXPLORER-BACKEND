const service = require("../services/visitorAccessService");

exports.acceso = async (req, res) => {
  const data = await service.accesoSimplificado(req.body);
  res.json({ ok: true, data });
};

exports.accesoFamiliar = async (req, res) => {
  const data = await service.accesoFamiliar(req.body);
  res.json({ ok: true, data });
};

exports.accesoGoogle = async (req, res) => {
  const data = await service.accesoGoogle(req.body);
  res.json({ ok: true, data });
};

exports.buscarTicket = async (req, res) => {
  const data = await service.buscarTicketPorDatos(req.visitante.id, req.body);
  res.json({ ok: true, data });
};

exports.me = async (req, res) => {
  const data = await service.obtenerPerfil(req.visitante.id);
  res.json({ ok: true, data });
};
