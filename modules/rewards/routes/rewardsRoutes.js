const router = require("express").Router();
const ctrl = require("../controllers/rewardsController");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const authVisitor = require("../../../middleware/authVisitor");

// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/:id/canjear", authVisitor, asyncHandler(ctrl.canjear));
router.get("/visitante/historial", authVisitor, asyncHandler(ctrl.historial));


module.exports = router;
