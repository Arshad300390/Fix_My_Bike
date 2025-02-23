const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');
const userRoutes = require("./route/user_route");
const bikeRoutes = require("./route/bike_route");
const serviceRoutes = require("./route/service_route");
const bookingRoutes = require('./route/booking_route');
const productRoutes = require('./route/product_route');

const googleSigninRoutes = require("./route/google_signin_route");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/social-auth", googleSigninRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api", bookingRoutes);
app.use("/api", productRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
   
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
