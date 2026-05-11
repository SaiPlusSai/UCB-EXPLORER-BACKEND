const colegioModel = require("../models/colegioModel");

exports.listar = async (req, res) => {
  const data = await colegioModel.listar();

  res.json({
    ok: true,
    data,
  });
};

exports.crear = async (req, res) => {
  try {
    const data = await colegioModel.crear({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      departamento: req.body.departamento,
      pais: req.body.pais,
      adminId: req.admin?.id,
    });

    res.status(201).json({
      ok: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const data = await colegioModel.actualizar(
      req.params.id,
      req.body
    );

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await colegioModel.eliminar(req.params.id);

    res.json({
      ok: true,
      mensaje: "Colegio eliminado",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};