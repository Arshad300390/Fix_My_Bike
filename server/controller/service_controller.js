const Service = require("../model/service_model");

const createService = async (req, res) => {
  try {
    const { name, description, cost, category } = req.body;

    const service = new Service({
      name,
      description,
      cost,
      category,
    });

    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

module.exports = {
  createService,
  getAllServices,
};
