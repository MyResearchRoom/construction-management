const { Op } = require("sequelize");
const { FuelLog ,Vehicle} = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

exports.addFuelLog = async (req, res) => {
  try {
    const fuelLogData = {
      ...req.body,
      billPhoto: req.file ? req.file.buffer : null,
      imageContentType: req.file ? req.file.mimetype : null,
    };
    const fuelLog = await FuelLog.create(fuelLogData);
    successResponse(res, "Fuel log added successfully", fuelLog);
  } catch (error) {
    errorResponse(res);
  }
};

exports.getAllFuelLogs = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { searchTerm } = req.query;

    const whereCondition = {};

    const vehicleInclude = {
      model: Vehicle,
      as: "vehicle",
      attributes: ["id", "vehicleName", "registrationNumber", "type", "targetEfficiency", "vehicleId"],
    };

    if (searchTerm) {
      vehicleInclude.where = {
        [Op.or]: [
          { vehicleName: { [Op.like]: `%${searchTerm}%` } },
          { registrationNumber: { [Op.like]: `%${searchTerm}%` } },
          { type: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
      
      vehicleInclude.required = true;
    }

    const { count, rows } = await FuelLog.findAndCountAll({
      where: whereCondition,
      include: [vehicleInclude],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    successResponse(res, "Fuel logs fetched successfully", {
      logs: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    errorResponse(res);
  }
};

