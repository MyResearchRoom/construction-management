const { Vehicle } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");

const generateVehicleId = async () => {
  const count = await Vehicle.count();
  const next = (count + 1).toString().padStart(3, "0");
  return `VEH-${next}`;
};

exports.addVehicle = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    const existingVehicle = await Vehicle.findOne({
      where: { registrationNumber },
    });

    if (existingVehicle) {
      return errorResponse(
        res,
        "Vehicle already exists with this registration number",
        402
      );
    }
    const vehicleId = await generateVehicleId();
    const vehicle = await Vehicle.create({ ...req.body, vehicleId });


    successResponse(res, "Vehicle added successfully", vehicle);
  } catch (error) {
    console.log(error);
    
    errorResponse(res);
  }
};

exports.editVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findOne({ where: { id } });
    if (!vehicle) return errorResponse(res, "Vehicle not found", 404);

    const allowedFields = [
      "vehicleName",
      "type",
      "registrationNumber",
      "targetEfficiency",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await vehicle.update(updateData);

    return successResponse(res, "Vehicle updated successfully", vehicle);
  } catch (error) {
    console.error(error);
    return errorResponse(res);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ order: [["createdAt", "DESC"]] });
    successResponse(res, "Vehicles fetched successfully", vehicles);
  } catch (error) {
    errorResponse(res);
  }
};

//new by JB
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "Vehicle ID is required", 400);
    }

    const vehicle = await Vehicle.findOne({
      where: { id: id },
    });

    if (!vehicle) {
      return errorResponse(res, "Vehicle not found", 404);
    }

    return successResponse(
      res,
      "Vehicle details fetched successfully",
      vehicle
    );
  } catch (error) {
    console.error("Get Vehicle By ID Error:", error);
    return errorResponse(res);
  }
};
