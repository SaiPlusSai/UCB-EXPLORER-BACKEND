const router = require("express").Router();
const ctrl = require("../controllers/reminderController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");

router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante", authVisitor, asyncHandler(ctrl.crearVisitante));
router.put("/visitante/:id", authVisitor, asyncHandler(ctrl.actualizarVisitante));
router.delete("/visitante/:id", authVisitor, asyncHandler(ctrl.eliminarVisitante));


module.exports = router;
