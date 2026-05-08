const router = require("express").Router();
const ctrl = require("../controllers/reminderController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");
const authAdmin = require("../../../middleware/authAdmin");

// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante", authVisitor, asyncHandler(ctrl.crearVisitante));
router.put("/visitante/:id", authVisitor, asyncHandler(ctrl.actualizarVisitante));
router.delete("/visitante/:id", authVisitor, asyncHandler(ctrl.eliminarVisitante));

// Admin
router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crearAdmin));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizarAdmin));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminarAdmin));

module.exports = router;
