const service = require("../services/reminderService");

exports.listarVisitante = async (
  req,
  res
) => {

  res.json({
    ok: true,

    data:
      await service.listarVisitante(
        req.visitante.id
      ),
  });
};

exports.crearVisitante = async (
  req,
  res
) => {

  const data =
    await service.crearVisitante(
      req.visitante.id,
      req.body
    );

  res.status(201).json({
    ok: true,
    data,
  });
};

exports.actualizarVisitante = async (
  req,
  res
) => {

  const data =
    await service.actualizar(
      req.params.id,
      req.body,
      {
        tipo: "visitante",
        id: req.visitante.id,
      }
    );

  res.json({
    ok: true,
    data,
  });
};

exports.eliminarVisitante = async (
  req,
  res
) => {

  await service.eliminar(
    req.params.id,
    {
      tipo: "visitante",
      id: req.visitante.id,
    }
  );

  res.json({
    ok: true,
    mensaje:
      "Recordatorio eliminado",
  });
};

exports.listarAdmin = async (req, res) => {

  const data = await service.listarAdmin();

  res.json({ ok: true, data });
};

exports.crearAdmin = async (req, res) => {

  const data = await service.crearAdmin(req.body);

  res.status(201).json({ ok: true, data });
};

exports.actualizarAdmin = async (req, res) => {

  const data = await service.actualizar(
    req.params.id,
    req.body,
    { tipo: "admin" }
  );

  res.json({ ok: true, data });
};

exports.eliminarAdmin = async (req, res) => {

  await service.eliminar(
    req.params.id,
    { tipo: "admin" }
  );

  res.json({ ok: true, mensaje: "Recordatorio eliminado" });
};