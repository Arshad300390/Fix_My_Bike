const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");

router.post("/add-product", authMiddleware, productController.addProduct);

router.get(
  "/get-products",
  authMiddleware,
  productController.getshopProducts
);
router.get("/get-products/:userId", authMiddleware, productController.getProductsByUserId);

router.get("/all/products", authMiddleware, productController.getAllProducts);

router.patch("/update-product/:id", authMiddleware, productController.updateProduct);

router.delete("/remove-product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
