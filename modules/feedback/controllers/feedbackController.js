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

exports.listarAdmin = async (req, res) => {

  const data = await service.listarAdmin();

  res.json({ ok: true, data });
};

exports.crear = async (req, res) => {

  const data = await service.crearPregunta(req.body);

  res.status(201).json({ ok: true, data });
};

exports.actualizar = async (req, res) => {

  const data = await service.actualizarPregunta(
    Number(req.params.id),
    req.body
  );

  res.json({ ok: true, data });
};

exports.eliminar = async (req, res) => {

  await service.eliminarPregunta(Number(req.params.id));

  res.json({ ok: true, mensaje: "Pregunta eliminada" });
};

exports.todasRespuestas = async (req, res) => {

  const data = await service.todasRespuestas();

  res.json({ ok: true, data });
};

exports.respuestasPregunta = async (req, res) => {

  const data = await service.respuestasPregunta(
    Number(req.params.id)
  );

  res.json({ ok: true, data });
};