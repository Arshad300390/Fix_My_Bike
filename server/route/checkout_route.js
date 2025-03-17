const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const checkoutController = require('../controller/checkout_controller');

router.post('/checkout/create', authMiddleware, checkoutController.createCheckout);
router.get('/checkouts', checkoutController.getAllCheckouts);
router.get('/checkout/:id', checkoutController.getCheckoutById);
router.delete('/checkout/:id', checkoutController.deleteCheckout);

module.exports = router;
