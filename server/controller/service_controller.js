const Service = require("../model/service_model");
const HttpError = require("../model/http_error");
const mongoose = require("mongoose");

exports.createService = async (req, res, next) => {
  try {
    const { service_name, service_description, service_price, service_model, engine_power } = req.body;
    const shopOwnerId = req.userId; 
    console.log(shopOwnerId);
    if (!service_name || !service_description || !service_price || !service_model || !engine_power) {
      return next(new HttpError("All fields are required", 400));
    }

    const newService = new Service({
      service_name,
      service_description,
      service_price,
      service_model,
      engine_power,
      shop_owner: shopOwnerId,
    });

    await newService.save();
    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (err) {
    console.error("Error adding service:", err);
    return next(new HttpError("Error adding service!", 500));
  }
};

exports.getAllServices = async (req, res, next) => {
  try {
    const items = await Service.find();

    res.status(200).json({ 
      count: items.length,
      Items: items 
    });
  } catch (err) {
    return next(new HttpError("Error fetching item services!", 500));
  }
}

// exports.getServicesByUserId = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const items = await Service.find({ shop_owner: userId });

//     res.status(200).json({ 
//       count: items.length,
//       Items: items 
//     });
//   } catch (err) {
//     return next(new HttpError("Error fetching item services!", 500));
//   }
// };




exports.getServicesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId); // Fix ObjectId conversion

    const services = await Service.aggregate([
      { 
        $match: { shop_owner: userObjectId }  // Ensure shop_owner matches userId
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "shop_owner",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "ratings", // Join with ratings collection
          localField: "shop_owner",
          foreignField: "shop_owner",
          as: "ratings",
        },
      },
      {
        $addFields: {
          shop_owner: "$shop_owner", // Keep shop_owner
          full_name: { $arrayElemAt: ["$userDetails.full_name", 0] }, // Extract first match
          email: { $arrayElemAt: ["$userDetails.email", 0] },
          rating: { $avg: "$ratings.rating" } // Get average rating
        },
      },
      {
        $project: {
          _id: 1,
          shop_owner: 1, // Explicitly include shop_owner
          service_name: 1,
          service_description: 1,
          service_price: 1,
          service_model: 1,
          engine_power: 1,
          full_name: 1,  // Include full_name from users
          email: 1,      // Include email from users
          rating: 1      // Include average rating
        },
      },
    ]);

    console.log("Final Aggregation Output:", services);
    res.status(200).json({ 
      count: services.length,
      Items: services
    });

  } catch (err) {
    console.error("Error fetching services with a rating:", err);
    return next(new HttpError("Error fetching services!", 500));
  }
};





exports.getShopServices = async (req, res, next) => {
  try {
    const userId = req.userId; 
    const services = await Service.find({ shop_owner: userId });

    if (!services.length) {
      return next(new HttpError("No services found for this shop.", 404));
    }

    res.json({ Services: services });
  } catch (err) {
    return next(new HttpError("Error fetching services!", 500));
  }
};


exports.getServiceById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const service = await Service.findOne({ _id: req.params.id, shop_owner: userId }).populate("shop_owner", "name email");

    if (!service) {
      return next(new HttpError("Service not found or unauthorized access.", 404));
    }

    res.status(200).json(service);
  } catch (error) {
    return next(new HttpError("Error fetching service!", 500));
  }
};


exports.updateService = async (req, res, next) => {
  try {
    const { service_name, service_description, service_price, service_model, engine_power } = req.body;
    const userId = req.userId;

    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, shop_owner: userId }, 
      { service_name, service_description, service_price, service_model, engine_power },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return next(new HttpError("Service not found or unauthorized access.", 404));
    }

    res.status(200).json(updatedService);
  } catch (error) {
    return next(new HttpError("Error updating service!", 500));
  }
};

// Delete a service (Only for the owner)
exports.deleteService = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const deletedService = await Service.findOneAndDelete({ _id: req.params.id, shop_owner: userId });

    if (!deletedService) {
      return next(new HttpError("Service not found or unauthorized access.", 404));
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    return next(new HttpError("Error deleting service!", 500));
  }
};
