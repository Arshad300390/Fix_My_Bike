const Booking = require("../model/booking_model");
const HttpError = require("../model/http_error");
const User = require("../model/user_model");

const createBooking = async (req, res, next) => {
  try {
    const {
      serviceName,
      serviceBasePrice,
      name,
      cell,
      address,
      comments,
      bikeModel,
      bikeName,
      bikeCompanyName,
      bikeRegNumber,
      additionalServices,
      dropOff,
      totalPrice,
    } = req.body;

    const bookingData = {
      userId: req.userId,
      serviceName,
      serviceBasePrice,
      name,
      cell,
      address,
      comments,
      bikeModel,
      bikeName,
      bikeCompanyName,
      bikeRegNumber,
      additionalServices,
      totalPrice,
      dropOff,
      timestamp: Date.now(),
      status: "pending",
    };

    const booking = new Booking(bookingData);

    const savedBooking = await booking.save();

    res
      .status(201)
      .json({ message: "Booking created successfully", data: savedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

const getAllUserBookings = async (req, res, next) => {
  try {

    const bookings = await Booking.find({
      $and: [
        { $or: [
          { status: { $regex: /^pending$/i } },
          { status: { $regex: /^in progress$/i } }
        ] },
        { SheduleDate: { $ne: null } } // Ensure SheduleDate is not null
      ]
    });
    if (!bookings.length) {
      return next(new HttpError("No booking yet.", 404));
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};




const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({
      userId, $or: [
        { status: "pending" },
        { status: "in progress" },]
    });

    if (!bookings.length) {
      return next(new HttpError("No bookings found for this user.", 404));
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};

const getNotSheduleBookings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ SheduleDate: null });

    res.status(200).json({
      count: bookings.length,
      Bookings: bookings, // Always send the array, even if it's empty
    });
  } catch (error) {
    return next(new HttpError("Error fetching bookings for shedule!", 500));
  }
};


const getUserBookingHistory = async (req, res, next) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ userId, status: { $regex: /^completed$/i } });

    if (!bookings.length) {
      return next(
        new HttpError("No bookings history found for this user.", 404)
      );
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};


const getAllUserBookingHistory = async (req, res, next) => {
  try {

    const bookings = await Booking.find({ status: { $regex: /^completed$/i } });

    if (!bookings.length) {
      return next(
        new HttpError("No bookings history found yet.", 404)
      );
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    return next(new HttpError("Error fetching bookings!", 500));
  }
};


const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res
      .status(200)
      .json({ message: "Booking status updated", data: updatedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};
//
const updateBookingShedule = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { SheduleDate: req.body.date },
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res
      .status(200)
      .json({ message: "Booking status updated", data: updatedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};
//


const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted", data: deletedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};
module.exports = {
  createBooking,
  getAllUserBookings,
  getUserBookings,
  getNotSheduleBookings,
  getUserBookingHistory,
  getAllUserBookingHistory,
  updateBookingShedule,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};
