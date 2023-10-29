const Router = require('express');
const router = new Router();
const UserController = require('../controllers/user');
const Auth = require('../middleware/Auth');

router.post( '/register',UserController.register );
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/auth', Auth, UserController.check )


module.exports = router;