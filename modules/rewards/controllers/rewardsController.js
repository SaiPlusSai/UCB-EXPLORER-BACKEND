const service = require("../services/rewardsService");

exports.listarVisitante = async (
  req,
  res
) => {

  res.json({
    ok: true,
    data:
      await service.listarParaVisitante(),
  });
};

exports.canjear = async (
  req,
  res
) => {

  const data =
    await service.canjear(
      req.visitante.id,
      Number(req.params.id)
    );

  res.json({
    ok: true,
    data,
  });
};

exports.historial = async (
  req,
  res
) => {

  res.json({
    ok: true,

    data:
      await service.historialVisitante(
        req.visitante.id
      ),
  });
};