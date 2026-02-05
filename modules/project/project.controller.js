const { Project ,Participant} = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");
const { Op } = require("sequelize");
const generateProjectId = async () => {
  const year = new Date().getFullYear();
  const count = await Project.count();
  const next = (count + 1).toString().padStart(3, "0");
  return `PROJ-${year}-${next}`;
};

exports.getAllProjects = async (req, res) => {
  try {
    const { page, limit, offset, searchTerm } = validateQueryParams({
      ...req.query,
    });

    const { role, id: userId } = req.user; 

    let whereClause = {};

    if (role === "PROJECT_MANAGER" || role ==="SITE_MANAGER" || role ==="FINANCE_MANAGER") {
      const participantProjects = await Participant.findAll({
        where: { userId },
        attributes: ["projectId"],
      });
      const projectIds = participantProjects.map((p) => p.projectId);

      whereClause.id = { [Op.in]: projectIds };
    }
    if (searchTerm) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { projectId: { [Op.like]: `%${searchTerm}%` } },
          { projectName: { [Op.like]: `%${searchTerm}%` } },
          { client: { [Op.like]: `%${searchTerm}%` } },
          { location: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    const { rows, count } = await Project.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    successResponse(res, "Projects fetched successfully", {
      projects: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch projects.", 500);
  }
};

exports.addProject = async (req, res) => {
  try {
    const projectId = await generateProjectId();

    const project = await Project.create(
      {
        projectId,
        ...req.body,
      },
      { userId: req.user.id, req }
    );

    successResponse(res, "Project added successfully", project);
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
  }
};

exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    await project.update(req.body, { userId: req.user.id, req });

    successResponse(res, "Project updated successfully", project);
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
  }
};

// exports.getAllProjects = async (req, res) => {
//   try {
//     const { page, limit, offset, searchTerm } = validateQueryParams({
//       ...req.query,
//     });
//     const { rows, count } = await Project.findAndCountAll({
//       where: searchTerm
//         ? {
//             [Op.or]: [
//               { projectId: { [Op.like]: `%${searchTerm}%` } },
//               { projectName: { [Op.like]: `%${searchTerm}%` } },
//               { client: { [Op.like]: `%${searchTerm}%` } },
//               { location: { [Op.like]: `%${searchTerm}%` } },
//             ],
//           }
//         : {},
//       order: [["createdAt", "DESC"]],
//       limit,
//       offset,
//     });

//     successResponse(res, "Projects fetched successfully", {
//       projects: rows,
//       pagination: {
//         totalRecords: count,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         itemsPerPage: limit,
//       },
//     });
//   } catch (error) {
//     errorResponse(res, "Failed to fetch projects.", 500);
//   }
// };

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }
    successResponse(res, "Project fetched successfully", project);
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
  }
};
