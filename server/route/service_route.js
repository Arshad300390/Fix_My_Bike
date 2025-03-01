const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const { createService, getShopServices, getServiceById, updateService, deleteService, getServicesByUserId } = require("../controller/service_controller");

router.post("/shop/services", authMiddleware, createService);
router.get("/shop/services",authMiddleware, getShopServices); 
router.get("/shop/get-services/:userId",authMiddleware, getServicesByUserId);  
router.get("/shop/services/:id",authMiddleware, getServiceById);
router.put("/shop/services/:id",authMiddleware, updateService);
router.delete("/shop/services/:id",authMiddleware, deleteService);

module.exports = router;
