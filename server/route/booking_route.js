const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking_controller');


router.post('/service-booking', bookingController.createBooking);


router.get('/service-bookings', bookingController.getAllBookings);


router.get('/service-booking/:id', bookingController.getBookingById);


router.put('/service-booking/:id/status', bookingController.updateBookingStatus);


router.delete('/service-booking/:id', bookingController.deleteBooking);

module.exports = router;
