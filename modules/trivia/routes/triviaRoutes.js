const router = require("express").Router();
const ctrl = require("../controllers/triviaController");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const authVisitor = require("../../../middleware/authVisitor");
const authAdmin = require("../../../middleware/authAdmin");

// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/responder", authVisitor, asyncHandler(ctrl.responder));
router.get("/visitante/historial", authVisitor, asyncHandler(ctrl.historial));

// Admin
router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.get("/admin/:id", authAdmin, asyncHandler(ctrl.obtenerAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crear));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminar));

module.exports = router;
