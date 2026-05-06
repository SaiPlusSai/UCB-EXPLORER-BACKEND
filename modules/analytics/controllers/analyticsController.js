const model = require("../models/analyticsModel");

exports.resumen = async (req, res) => {
  res.json({ ok: true, data: await model.resumen() });
};

exports.porColegio = async (req, res) => {
  res.json({ ok: true, data: await model.visitantesPorColegio() });
};

exports.carrerasMasElegidas = async (req, res) => {
  res.json({ ok: true, data: await model.carrerasMasElegidas() });
};

exports.topVisitantes = async (req, res) => {
  res.json({ ok: true, data: await model.topVisitantes() });
};

exports.registrarEvento = async (req, res) => {
  const data = await model.registrarEvento({
    ...req.body,
    visitante_id: req.body.visitante_id || req.visitante?.id || null,
  });
  res.status(201).json({ ok: true, data });
};
