const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const basketDeviceRouter = require('./basketDeviceRouter');
const ratingsRouter = require('./ratingsRouter');

router.use('/user',userRouter)
router.use('/type',typeRouter)
router.use('/brand',brandRouter)
router.use('/device', deviceRouter)
router.use("/basket", basketDeviceRouter);
router.use("/rating", ratingsRouter);


module.exports = router;