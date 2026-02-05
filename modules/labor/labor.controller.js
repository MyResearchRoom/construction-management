const { Op } = require("sequelize");
const { Labor, Project,Participant } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

exports.addLaborSummary = async (req, res) => {
  try {
    const {
      contractorName,
      projectId,
      maleWorkersCount,
      femaleWorkersCount,
      wageType,
      dailyWage,
    } = req.body;

    const labor = await Labor.create({
      contractorName,
      projectId,
      maleWorkersCount,
      femaleWorkersCount,
      wageType,
      dailyWage,
    });

    successResponse(res, "Labor summary added successfully", labor);
  } catch (error) {
    errorResponse(res);
  }
};

exports.getAllLaborSummaries = async (req, res) => {
  try {
    const { page, limit, offset, searchTerm } = validateQueryParams({
      ...req.query,
    });
    const { role, id: userId } = req.user; 
    const whereClause = {};

    if (role === "PROJECT_MANAGER" || role ==="SITE_MANAGER" || role ==="FINANCE_MANAGER") {
      const participantProjects = await Participant.findAll({
        where: { userId },
        attributes: ["projectId"],
      });
      const projectIds = participantProjects.map((p) => p.projectId);

      whereClause.projectId = projectIds;
    }

    if (searchTerm) {
      whereClause[Op.or] = [
        { contractorName: { [Op.like]: `%${searchTerm}%` } },
        { wageType: { [Op.like]: `%${searchTerm}%` } },
        { "$project.projectName$": { [Op.like]: `%${searchTerm}%` } },
      ];
    }
    const { count, rows } = await Labor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["projectName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    successResponse(res, "Labor summaries fetched successfully", {
      summery: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    errorResponse(res, "Failed to fetch labor summaries", 500);
  }
};
