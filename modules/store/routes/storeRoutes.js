const router = require("express").Router();
const ctrl = require("../controllers/storeController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");

// Public routes (anyone can browse)
router.get("/productos", asyncHandler(ctrl.listarProductos));
router.get("/productos/:id", asyncHandler(ctrl.obtenerProducto));
router.get("/categorias", asyncHandler(ctrl.listarCategorias));

// Protected routes (logged-in visitors)
router.post("/reservar", authVisitor, asyncHandler(ctrl.reservar));
router.get("/mis-reservas", authVisitor, asyncHandler(ctrl.misReservas));
router.put(
  "/reservas/:id/cancelar",
  authVisitor,
  asyncHandler(ctrl.cancelarReserva)
);

module.exports = router;
