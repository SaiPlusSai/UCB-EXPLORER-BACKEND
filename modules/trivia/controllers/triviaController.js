const service = require("../services/triviaService");

exports.listarVisitante = async (req, res) => {

  const data =
    await service.listarParaVisitante({
      carrera_id: req.query.carrera_id
        ? Number(req.query.carrera_id)
        : null,
    });

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