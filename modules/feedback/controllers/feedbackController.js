const service = require("../services/feedbackService");

exports.listarVisitante = async (
  req,
  res
) => {

  res.json({
    ok: true,

    data:
      await service.listarVisitante(),
  });
};

exports.responder = async (
  req,
  res
) => {

  const data =
    await service.responder(
      req.visitante.id,
      req.body.respuestas
    );

  res.json({
    ok: true,
    data,
  });
};