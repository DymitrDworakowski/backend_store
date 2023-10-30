const Router = require('express');
const router = new Router();
const BrandController = require('../controllers/brand');
const Check = require('../middleware/Check');

router.post( '/',Check("Admin"),BrandController.create)
router.get('/',BrandController.getAll)


module.exports = router;