const router = require("express").Router();
const ctrl = require("../controllers/authAdminController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");

router.post("/login", asyncHandler(ctrl.login));
router.get("/me", authAdmin, asyncHandler(ctrl.me));

router.post("/", authAdmin, asyncHandler(ctrl.crearAdmin));
router.get("/", authAdmin, asyncHandler(ctrl.listarAdmins));
router.put("/:id", authAdmin, asyncHandler(ctrl.actualizarAdmin));
router.patch("/:id/password", authAdmin, asyncHandler(ctrl.cambiarPassword));
router.delete("/:id", authAdmin, asyncHandler(ctrl.eliminarAdmin));

module.exports = router;
