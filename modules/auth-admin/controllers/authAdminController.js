const service = require("../services/authAdminService");

exports.login = async (req, res) => {
  const data = await service.login(req.body);
  res.json({ ok: true, data });
};

exports.me = async (req, res) => {
  const data = await service.obtenerPerfil(req.admin.id);
  res.json({ ok: true, data });
};

exports.crearAdmin = async (req, res) => {
  const data = await service.crearAdmin(req.body);
  res.status(201).json({ ok: true, data });
};

exports.listarAdmins = async (req, res) => {
  const data = await service.listarAdmins();
  res.json({ ok: true, data });
};

exports.actualizarAdmin = async (req, res) => {
  const data = await service.actualizarAdmin(req.params.id, req.body);
  res.json({ ok: true, data });
};

exports.cambiarPassword = async (req, res) => {
  await service.cambiarPassword(req.params.id, req.body.password);
  res.json({ ok: true, mensaje: "Password actualizada" });
};

exports.eliminarAdmin = async (req, res) => {
  await service.eliminarAdmin(req.params.id);
  res.json({ ok: true, mensaje: "Administrador eliminado" });
};
