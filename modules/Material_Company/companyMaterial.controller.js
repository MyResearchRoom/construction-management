const { Op } = require("sequelize");
const { Company,CompanyMaterial } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

exports.saveMaterialData = async(req,res)=>{
 try{
    if (!req.user.companyId) {
      return errorResponse(res, "Company not found for this user.", 400);
    }

    const { materialName } = req.body;

    if (!materialName) {
      return errorResponse(res, "Material name is required.", 400);
    }

    const materialData = {
      companyId: req.user.companyId,
      materialName,
    };

    const material=await CompanyMaterial.create(materialData);

    successResponse(res, "Material added successfully", material);
  } catch (error) {
    errorResponse(res);
  }
};

exports.getAllMaterialData = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { searchTerm } = req.query;

    let companyId = req.user.companyId;
    let whereClause = {};

    if (!companyId) {
      const company = await Company.findOne({
        attributes: ["id"],
      });
      companyId = company?.id;
    }

    whereClause.companyId = companyId;

    if (searchTerm) {
      whereClause[Op.or] = [
        { materialName: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await CompanyMaterial.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    successResponse(res, "Materials fetched successfully", {
      material: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};
