const router = require("express").Router();
const ctrl = require("../controllers/visitorAccessController");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const authVisitor = require("../../../middleware/authVisitor");

router.post("/acceso", asyncHandler(ctrl.acceso));
router.get("/me", authVisitor, asyncHandler(ctrl.me));

module.exports = router;
