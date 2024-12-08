const express = require("express");
const router = express.Router();
const bikeController = require("../controller/bike_controller");
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");

router.post("/add-bike", authMiddleware, bikeController.addBike);

router.get(
  "/get-bike-by-user/:id",
  authMiddleware,
  bikeController.getUserBikes
);

router.patch("/update-bike/:id", authMiddleware, bikeController.updateBike);

router.delete("/remove-bike/:id", authMiddleware, bikeController.deleteBike);

module.exports = router;
