const { Company,CompanyMaterial,CompanyMaterialTransaction,sequelize } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");
const { Op, where } = require("sequelize");

exports.saveMaterialTransactionData = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { materialId, quantity, pricePerUnit, supplierName } = req.body;

    if (materialId == null || quantity == null || pricePerUnit == null || !supplierName) {
      await t.rollback();
      return errorResponse(res, "Provide all required fields.", 400);
    }

    const material = await CompanyMaterial.findByPk(materialId, { transaction: t });

    if (!material) {
      await t.rollback();
      return errorResponse(res, "Material not found", 404);
    }

    const materialTransaction = await CompanyMaterialTransaction.create(
      {
        materialId,
        quantity,
        pricePerUnit,
        supplierName,
        image: req.file ? req.file.buffer : null,
        imageContentType: req.file ? req.file.mimetype : null,
      },
      { transaction: t }
    );

    await material.increment(
      { available_quantity: quantity },
      { transaction: t }
    );

    await t.commit();

    successResponse(res, "Material transaction added successfully", materialTransaction);
  } catch (error) {
    await t.rollback();
    console.error(error);
    errorResponse(res);
  }
};

// exports.getAllCompanyMaterialTransaction = async (req, res) => {
//   try {
//     const { page, limit, offset } = validateQueryParams({ ...req.query });
//     const { searchTerm } = req.query;

//     const materialInclude = {
//       model: CompanyMaterial,
//       as: "companyMaterial",
//       attributes: ["id", "materialName"],
//       required: false, 
//     };

//     const whereCondition = {};
//     if (searchTerm) {
//       whereCondition[Op.or] = [
//         { supplierName: { [Op.like]: `%${searchTerm}%` } },
//         { quantity: !isNaN(searchTerm) ? Number(searchTerm) : null },
//         { pricePerUnit: !isNaN(searchTerm) ? Number(searchTerm) : null },
//         { "$companyMaterial.materialName$": { [Op.like]: `%${searchTerm}%` } },
//       ].filter(Boolean); 
//     }

//     const { count, rows } = await CompanyMaterialTransaction.findAndCountAll({
//       where: whereCondition,
//       include: [materialInclude],
//       offset,
//       limit,
//       order: [["createdAt", "DESC"]],
//     });

//     successResponse(res, "Material transactions fetched successfully", {
//       transactions: rows,
//       pagination: {
//         totalRecords: count,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         itemsPerPage: limit,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     errorResponse(res);
//   }
// };

exports.getAllCompanyMaterialTransaction = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { searchTerm } = req.query;

    const materialInclude = {
      model: CompanyMaterial,
      as: "companyMaterial",
      attributes: ["id", "materialName","available_quantity"],
      required: false,
    };

    const whereCondition = {};
    if (searchTerm) {
      whereCondition[Op.or] = [
        { supplierName: { [Op.like]: `%${searchTerm}%` } },
        !isNaN(searchTerm) ? { quantity: Number(searchTerm) } : null,
        !isNaN(searchTerm) ? { pricePerUnit: Number(searchTerm) } : null,
        { "$companyMaterial.materialName$": { [Op.like]: `%${searchTerm}%` } },
      ].filter(Boolean);
    }


    const { count, rows } = await CompanyMaterialTransaction.findAndCountAll({
      where: whereCondition,
      include: [materialInclude],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const transactions = rows.map((t) => {
      const json = t.toJSON();
      if (json.image && json.imageContentType) {
        json.image = `data:${json.imageContentType};base64,${Buffer.from(json.image).toString("base64")}`;
      }
      return json;
    });


    successResponse(res, "Material transactions fetched successfully", {
      transactions: transactions,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res);
  }
};
