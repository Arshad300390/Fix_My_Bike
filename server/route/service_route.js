const express = require("express");
const router = express.Router();
const serviceController = require("../controller/service_controller");

router.post('/createService', serviceController.createService);
router.get('/getAllServices', serviceController.getAllServices);





module.exports = router;
