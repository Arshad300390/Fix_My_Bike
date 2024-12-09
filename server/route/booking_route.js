const express = require('express');
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const router = express.Router();
const bookingController = require('../controller/booking_controller');


router.post('/service-booking', authMiddleware, bookingController.createBooking);


router.get('/service-bookings', authMiddleware, bookingController.getUserBookings);

router.get('/service-History', authMiddleware, bookingController.getUserBookingHistory);

router.get('/service-booking/:id', authMiddleware, bookingController.getBookingById);


router.put('/service-booking/:id/status', authMiddleware, bookingController.updateBookingStatus);


router.delete('/service-booking/:id', authMiddleware, bookingController.deleteBooking);

module.exports = router;
