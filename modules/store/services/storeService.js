const productoModel = require("../models/productoModel");
const reservaModel = require("../models/reservaModel");
const HttpError = require("../../../shared/utils/httpError");

const listarProductos = async (filtros = {}) => {
  return productoModel.listar({ ...filtros, activo: true });
};

const obtenerProducto = async (id) => {
  const producto = await productoModel.obtener(id);
  if (!producto) throw new HttpError(404, "Producto no encontrado");
  return producto;
};

const listarCategorias = async () => {
  return productoModel.listarCategorias();
};

const reservarProducto = async (visitante_id, producto_id, cantidad = 1) => {
  const producto = await productoModel.obtener(producto_id);
  if (!producto) throw new HttpError(404, "Producto no encontrado");
  if (!producto.activo) throw new HttpError(400, "Producto no disponible");
  if (producto.stock < cantidad)
    throw new HttpError(400, "Stock insuficiente");

  const actualizado = await productoModel.reducirStock(producto_id, cantidad);
  if (!actualizado)
    throw new HttpError(400, "No se pudo reservar, stock insuficiente");

  const reserva = await reservaModel.crear({
    visitante_id,
    producto_id,
    cantidad,
  });

  return {
    reserva,
    producto: {
      nombre: producto.nombre,
      precio: producto.precio,
    },
  };
};

const misReservas = async (visitante_id) => {
  return reservaModel.listarPorVisitante(visitante_id);
};

const cancelarReserva = async (id, visitante_id) => {
  const reserva = await reservaModel.cancelar(id, visitante_id);
  if (!reserva)
    throw new HttpError(
      400,
      "No se pudo cancelar. La reserva no existe o ya fue procesada."
    );
  return reserva;
};

module.exports = {
  listarProductos,
  obtenerProducto,
  listarCategorias,
  reservarProducto,
  misReservas,
  cancelarReserva,
};
