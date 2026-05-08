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

exports.listarAdmin = async (req, res) => {

  const data = await service.listarParaAdmin();

  res.json({ ok: true, data });
};

exports.crear = async (req, res) => {

  const data = await service.crear(req.body);

  res.status(201).json({ ok: true, data });
};

exports.actualizar = async (req, res) => {

  const data = await service.actualizar(
    Number(req.params.id),
    req.body
  );

  res.json({ ok: true, data });
};

exports.eliminar = async (req, res) => {

  await service.eliminar(Number(req.params.id));

  res.json({ ok: true, mensaje: "Premio eliminado" });
};

exports.todosCanjes = async (req, res) => {

  const data = await service.todosLosCanjes();

  res.json({ ok: true, data });
};