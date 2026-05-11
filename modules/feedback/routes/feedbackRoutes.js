const router = require("express").Router();
const ctrl = require("../controllers/feedbackController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");
const authAdmin = require("../../../middleware/authAdmin");

// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.get(
  "/visitante/mis-respuestas",
  authVisitor,
  asyncHandler(ctrl.misRespuestas)
);
router.post("/visitante/responder", authVisitor, asyncHandler(ctrl.responder));

// Admin — /admin/respuestas BEFORE /admin/:id/respuestas
router.get("/admin/respuestas", authAdmin, asyncHandler(ctrl.todasRespuestas));
router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crear));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminar));
router.get("/admin/:id/respuestas", authAdmin, asyncHandler(ctrl.respuestasPregunta));

module.exports = router;
