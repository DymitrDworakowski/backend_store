const Router = require('express');
const router = new Router();
const DeviceController = require('../controllers/device');
const Check = require('../middleware/Check');

router.post( '/',Check("Admin"),DeviceController.create)
router.get('/',DeviceController.getAll)
router.get('/:id',DeviceController.getById)

module.exports = router;