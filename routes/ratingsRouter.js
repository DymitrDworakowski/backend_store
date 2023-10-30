const Router = require("express");
const router = new Router();
const Rating = require("../controllers/rating");

router.post("/", Rating.create);
router.delete("/:id", Rating.deleteRating);
router.patch("/:id", Rating.updateRating);

module.exports = router;
