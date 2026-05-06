const router = require("express").Router();
const ctrl = require("../controllers/rewardsController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");
const authVisitor = require("../../../middleware/authVisitor");

// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/:id/canjear", authVisitor, asyncHandler(ctrl.canjear));
router.get("/visitante/historial", authVisitor, asyncHandler(ctrl.historial));

// Admin
router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crear));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminar));
router.get("/admin/canjes", authAdmin, asyncHandler(ctrl.todosCanjes));

module.exports = router;
