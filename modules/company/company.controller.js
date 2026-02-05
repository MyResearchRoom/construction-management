const { Company } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");

exports.saveCompanyData = async (req, res) => {
  try {
    let company = await Company.findOne({ where: { userId: req.user.id } });
    if (!company) {
      company = await Company.create({ userId: req.user.id, ...req.body });
    } else {
      company = await Company.update(
        { ...req.body },
        { where: { userId: req.user.id } }
      );
    }

    successResponse(res, "Data save successfully", company);
  } catch (error) {
    console.log(error);
    
    errorResponse(res, "Failed to save data", 500);
  }
};

exports.getCompanyData = async (req, res) => {
  try {
    const data = await Company.findOne({ where: { userId: req.user.id } });
    if (!data) return successResponse(res, "No company data found", null);
    successResponse(res, "Data retrieved successfully", data);
  } catch (error) {
    errorResponse(res, "Failed to get data", 500);
  }
};
