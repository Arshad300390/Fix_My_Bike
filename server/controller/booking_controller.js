const Booking = require('../model/booking_model');


exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json({ message: 'Booking created successfully', data: savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking status updated', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted', data: deletedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};
