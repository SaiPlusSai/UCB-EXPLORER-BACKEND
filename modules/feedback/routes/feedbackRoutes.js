const router = require("express").Router();
const ctrl = require("../controllers/feedbackController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");
const authVisitor = require("../../../middleware/authVisitor");

router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/responder", authVisitor, asyncHandler(ctrl.responder));

router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crear));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminar));
router.get("/admin/respuestas", authAdmin, asyncHandler(ctrl.todasRespuestas));
router.get("/admin/:id/respuestas", authAdmin, asyncHandler(ctrl.respuestasPregunta));

module.exports = router;
