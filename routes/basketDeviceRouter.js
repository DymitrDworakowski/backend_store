const Router = require("express");
const router = new Router();
const BasketDevice = require("../controllers/basketDevice");

router.post("/", BasketDevice.create);
router.delete("/:id", BasketDevice.deleteDevice);
router.get("/", BasketDevice.getById);

module.exports = router;
