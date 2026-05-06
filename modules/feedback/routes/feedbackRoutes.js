const router = require("express").Router();
const ctrl = require("../controllers/feedbackController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");

router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/responder", authVisitor, asyncHandler(ctrl.responder));

module.exports = router;
