const Router = require('express');
const router = new Router();
const User = require('../controllers/user');

router.post( '/register',User.register );
router.post('/login',User.login );
router.get('/auth', User.check )


module.exports = router;