const router = require("express").Router();
const ctrl = require("../controllers/rewardsController");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const authVisitor = require("../../../middleware/authVisitor");
const authAdmin = require("../../../middleware/authAdmin");

const upload = require("../../../middleware/uploadMiddleware");
// Visitante
router.get("/visitante", authVisitor, asyncHandler(ctrl.listarVisitante));
router.post("/visitante/:id/canjear", authVisitor, asyncHandler(ctrl.canjear));
router.get("/visitante/historial", authVisitor, asyncHandler(ctrl.historial));

// Admin — /canjes BEFORE /:id to avoid conflict
router.get("/admin/canjes", authAdmin, asyncHandler(ctrl.todosCanjes));
router.get("/admin", authAdmin, asyncHandler(ctrl.listarAdmin));
router.post("/admin", authAdmin, asyncHandler(ctrl.crear));
router.put("/admin/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/admin/:id", authAdmin, asyncHandler(ctrl.eliminar));
router.post(
  "/admin/upload",
  authAdmin,
  upload.single("imagen"),
  asyncHandler(ctrl.subirImagenPremio)
);
module.exports = router;
