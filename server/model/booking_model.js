const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  serviceName: { type: String, required: true },
  serviceBasePrice: { type: Number, required: true },
  name: { type: String, required: true },
  cell: { type: String, required: true },
  address: { type: String, required: true },
  comments: { type: String },
  bikeModel: { type: String, required: true },
  bikeName: { type: String, required: true },
  bikeCompanyName: { type: String, required: true },
  bikeRegNumber: { type: String, required: true },
  additionalServices: { type: [String] },
  totalPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);
