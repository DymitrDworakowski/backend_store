const { getAllProducts } = require("../controllers/productController");

router.get("/products", getAllProducts);
