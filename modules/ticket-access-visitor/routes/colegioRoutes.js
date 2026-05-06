const router = require("express").Router();
const ctrl = require("../controllers/colegioController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authAdmin = require("../../../middleware/authAdmin");

router.get("/", asyncHandler(ctrl.listar));
router.post("/", authAdmin, asyncHandler(ctrl.crear));
router.put("/:id", authAdmin, asyncHandler(ctrl.actualizar));
router.delete("/:id", authAdmin, asyncHandler(ctrl.eliminar));

module.exports = router;
