const service = require("../services/triviaService");

exports.listarVisitante = async (req, res) => {

  const data =
    await service.listarParaVisitante(
      req.visitante.id
    );

  res.json({
    ok: true,
    data,
  });
};

exports.responder = async (req, res) => {

  const data = await service.responder(
    req.visitante.id,
    req.body
  );

  res.json({
    ok: true,
    data,
  });
};

exports.historial = async (req, res) => {

  const data = await service.historial(
    req.visitante.id
  );

  res.json({
    ok: true,
    data,
  });
};

exports.listarAdmin = async (req, res) => {

  const data = await service.listarParaAdmin({
    carrera_id: req.query.carrera_id
      ? Number(req.query.carrera_id)
      : null,
  });

  res.json({
    ok: true,
    data,
  });
};

exports.obtenerAdmin = async (req, res) => {

  const data = await service.obtenerParaAdmin(
    Number(req.params.id)
  );

  res.json({
    ok: true,
    data,
  });
};

exports.crear = async (req, res) => {

  const data = await service.crear(
    req.body
  );

  res.status(201).json({
    ok: true,
    data,
  });
};

exports.actualizar = async (req, res) => {

  const data = await service.actualizar(
    Number(req.params.id),
    req.body
  );

  res.json({
    ok: true,
    data,
  });
};

exports.eliminar = async (req, res) => {

  await service.eliminar(
    Number(req.params.id)
  );

  res.json({
    ok: true,
    mensaje: "Pregunta eliminada",
  });
};