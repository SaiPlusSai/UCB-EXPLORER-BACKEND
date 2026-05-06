const router = require("express").Router();
const ctrl = require("../controllers/analyticsController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");

router.get("/resumen", authAdmin, asyncHandler(ctrl.resumen));
router.get("/colegios", authAdmin, asyncHandler(ctrl.porColegio));
router.get("/carreras", authAdmin, asyncHandler(ctrl.carrerasMasElegidas));
router.get("/top-visitantes", authAdmin, asyncHandler(ctrl.topVisitantes));
router.post("/eventos", asyncHandler(ctrl.registrarEvento));

module.exports = router;
