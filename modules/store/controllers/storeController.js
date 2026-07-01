const service = require("../services/storeService");

exports.listarProductos = async (req, res) => {
  const { categoria } = req.query;
  const data = await service.listarProductos({ categoria });
  res.json({ ok: true, data });
};

exports.obtenerProducto = async (req, res) => {
  const data = await service.obtenerProducto(Number(req.params.id));
  res.json({ ok: true, data });
};

exports.listarCategorias = async (req, res) => {
  const data = await service.listarCategorias();
  res.json({ ok: true, data });
};

exports.reservar = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  const data = await service.reservarProducto(
    req.visitante.id,
    producto_id,
    cantidad || 1
  );
  res.json({ ok: true, data });
};

exports.misReservas = async (req, res) => {
  const data = await service.misReservas(req.visitante.id);
  res.json({ ok: true, data });
};

exports.cancelarReserva = async (req, res) => {
  const data = await service.cancelarReserva(
    Number(req.params.id),
    req.visitante.id
  );
  res.json({ ok: true, data });
};
