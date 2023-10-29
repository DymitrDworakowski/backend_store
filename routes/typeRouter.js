const Router = require("express");
const router = new Router();
const TypeController = require("../controllers/type");
const Check = require("../middleware/Check");

router.post("/", Check("Admin"), TypeController.create);
router.get("/", TypeController.getAll);

module.exports = router;
