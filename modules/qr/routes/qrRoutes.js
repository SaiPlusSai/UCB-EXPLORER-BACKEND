const router = require("express").Router();
const ctrl = require("../controllers/qrController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");
const authVisitor = require("../../../middleware/authVisitor");

router.post("/visitante/escanear", authVisitor, asyncHandler(ctrl.escanear));
router.get("/visitante/historial", authVisitor, asyncHandler(ctrl.historial));
// ADMIN
router.get("/admin/escaneos", authAdmin, asyncHandler(ctrl.adminTodos));




router.post(
  "/admin/generar",
  authAdmin,
  asyncHandler(ctrl.generarQR)
);

router.get(
  "/admin/generados",
  authAdmin,
  asyncHandler(
    ctrl.listarQRGenerados
  )
);

module.exports = router;
