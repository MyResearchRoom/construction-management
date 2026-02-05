const { Op } = require("sequelize");
const { Tender } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

async function generateTenderId() {
  const year = new Date().getFullYear();
  const lastTender = await Tender.findOne({
    where: { tenderId: { [Op.like]: `TND-${year}-%` } },
    order: [["createdAt", "DESC"]],
  });

  let nextNum = 1;
  if (lastTender) {
    const parts = lastTender.tenderId.split("-");
    nextNum = parseInt(parts[2]) + 1;
  }

  return `TND-${year}-${String(nextNum).padStart(3, "0")}`;
}

exports.createTender = async (req, res) => {
  try {
    const tenderId = await generateTenderId();
    const boq = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;
    const isProjectNameExists = await Tender.findOne({
      where: {
        projectName: req.body.projectName,
      },
    });
    if (isProjectNameExists) {
      return errorResponse(
        res,
        "Project with provided project name already exists.",
        400
      );
    }
    const tender = await Tender.create(
      {
        tenderId,
        ...req.body,
        boq,
      },
      { userId: req.user.id, req }
    );

    successResponse(res, "Tender created successfully", tender);
  } catch (error) {
    errorResponse(res, "Something went wrong.", 500);
  }
};

exports.editTender = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);
    if (!tender) return errorResponse(res, "Tender not found", 404);

    if (req.body.projectName !== tender.projectName) {
      const isProjectNameExists = await Tender.findOne({
        where: {
          projectName: req.body.projectName,
        },
      });
      if (isProjectNameExists) {
        return errorResponse(
          res,
          "Project with provided project name already exists.",
          400
        );
      }
    }

    const boq = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : tender.boq;

    await tender.update(
      {
        ...req.body,
        boq,
      },
      { userId: req.user.id, req }
    );

    successResponse(res, "Tender updated successfully", tender);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

exports.changeTenderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tender = await Tender.findByPk(id, {
      attributes: ["id", "status"],
    });
    if (!tender) return errorResponse(res, "Tender not found", 404);

    if (
      ![
        "new",
        "boqPreparation",
        "rateAnalysis",
        "submitted",
        "won",
        "lost",
        "cancelled",
      ].includes(status)
    )
      return errorResponse(res, "Invalid status value", 400);

    await tender.update({ status }, { userId: req.user.id, req });
    successResponse(res, "Tender status updated successfully", tender);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

exports.getAllTenders = async (req, res) => {
  try {
    const { page, limit, offset, searchTerm } = validateQueryParams({
      ...req.query,
    });
    const { state, department } = req.query;
    const whereClause = {};
    if (searchTerm) {
      whereClause[Op.or] = [
        { tenderId: { [Op.like]: `%${searchTerm}%` } },
        { projectName: { [Op.like]: `%${searchTerm}%` } },
        { client: { [Op.like]: `%${searchTerm}%` } },
        { location: { [Op.like]: `%${searchTerm}%` } },
        // { state: { [Op.like]: `%${searchTerm}%` } },
      ];
    }
    if (state) {
      whereClause.state = state;
    }
    if (department) {
      whereClause.department = department;
    }
    const { rows, count } = await Tender.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["boq"] },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    successResponse(res, "Tenders retrieved successfully", {
      tenders: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    errorResponse(res, "Something went wrong.", 500);
  }
};

exports.getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return errorResponse(res, "Tender not found.", 404);
    }
    if (tender.boq) {
      tender.boq = tender.boq.toString("utf-8");
    }
    successResponse(res, "Tender retrieved successfully", tender);
  } catch (error) {
    errorResponse(res, "Something went wrong.", 500);
  }
};
