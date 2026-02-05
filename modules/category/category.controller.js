const { Op } = require("sequelize");
const { Category } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

exports.saveCategoryData = async(req,res)=>{
 try{
    const { categoryName } = req.body;
    console.log("Category:", Category);


    if (!categoryName) {
      return errorResponse(res, "category name is required.", 400);
    }
    console.log("Category:", Category);


    const category = await Category.create({ categoryName });

    successResponse(res, "category added successfully", category);
  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};

exports.getAllCategoryData = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { searchTerm } = req.query;

    const whereClause = {};

    if (searchTerm) {
      whereClause[Op.or] = [
        { categoryName: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
    });

    successResponse(res, "Category fetched successfully", {
      categories: rows,
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