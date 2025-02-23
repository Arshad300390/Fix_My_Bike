const Service = require("../model/Service_model");
const HttpError = require("../model/http_error");


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
