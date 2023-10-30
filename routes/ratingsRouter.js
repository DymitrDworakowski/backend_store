const Router = require("express");
const router = new Router();
const Rating = require("../controllers/rating");

router.post("/", Rating.create);
router.delete("/:id", Rating.deleteRating);
router.get("/:id", Rating.getById);

module.exports = router;
