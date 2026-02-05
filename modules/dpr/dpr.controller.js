const {
  Dpr,
  DieselReport,
  LaborReport,
  MaterialOnSite,
  WorkDone,
  SitePhoto,
  DailyExpense,
  Project,
  sequelize,
  Participant,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");
const { Op } = require("sequelize");

exports.addDpr = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      projectId,
      nameOfSite,
      nameOfSupervisor,
      date,
      dateOfSubmission,
    } = req.body;

    // console.log("frontend data",req.body);

    const workDone = JSON.parse(req.body.workDone || "[]");
    const materialOnSite = JSON.parse(req.body.materialOnSite || "[]");
    const dailyExpense = JSON.parse(req.body.dailyExpense || "[]");
    const dieselReport = JSON.parse(req.body.dieselReport || "[]");
    const laborReport = JSON.parse(req.body.laborReport || "[]");

    const photos = req.files || [];

    const dpr = await Dpr.create(
      {
        projectId,
        nameOfSite,
        nameOfSupervisor,
        date,
        dateOfSubmission,
      },
      { transaction }
    );
    const workDoneData =
      workDone.length > 0
        ? workDone.map((item) => ({ dprId: dpr.id, ...item }))
        : [];
    const materialOnSiteData =
      materialOnSite.length > 0
        ? materialOnSite?.map((item) => ({
            dprId: dpr.id,
            ...item,
          }))
        : [];
    const dailyExpenseData =
      dailyExpense.length > 0
        ? dailyExpense?.map((item) => ({
            dprId: dpr.id,
            ...item,
          }))
        : [];
    const dieselReportData =
      dieselReport.length > 0
        ? dieselReport?.map((item) => ({
            dprId: dpr.id,
            ...item,
          }))
        : [];
    const laborReportData =
      laborReport.length > 0
        ? laborReport?.map((item) => ({
            dprId: dpr.id,
            ...item,
          }))
        : [];
    const photosData =
      photos.length > 0
        ? photos?.map((photo) => ({
            dprId: dpr.id,
            photo: `data:${photo.mimetype};base64,${photo.buffer.toString(
              "base64"
            )}`,
            fileName: photo.originalname,
          }))
        : [];

    if (workDoneData?.length)
      await WorkDone.bulkCreate(workDoneData, { transaction });
    if (materialOnSiteData?.length)
      await MaterialOnSite.bulkCreate(materialOnSiteData, { transaction });
    if (dailyExpenseData?.length)
      await DailyExpense.bulkCreate(dailyExpenseData, { transaction });
    if (dieselReportData?.length)
      await DieselReport.bulkCreate(dieselReportData, { transaction });
    if (laborReportData?.length)
      await LaborReport.bulkCreate(laborReportData, { transaction });
    if (photosData?.length)
      await SitePhoto.bulkCreate(photosData, { transaction });

    await transaction.commit();

    successResponse(res, "Daily progress report added successfully", {
      dprId: dpr.id,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.log(error);
    
    errorResponse(res, "Failed to add daily progress report", 500);
  }
};

// exports.getDprs = async (req, res) => {
//   try {
//     const { page, limit, offset } = validateQueryParams({ ...req.query });
//     const { projectId, searchTerm } = req.query;

//     const whereCondition = projectId ? { projectId } : {};

//     if (searchTerm) {
//       whereCondition[Op.or] = [
//         { nameOfSupervisor: { [Op.like]: `%${searchTerm}%` } },
//       ];
//     }

//     const { rows, count } = await Dpr.findAndCountAll({
//       where: whereCondition,
//       include: [
//         {
//           model: Project,
//           as: "project",
//           attributes: ["id", "projectName",  "location"],
//           where: searchTerm
//             ? {
//                 [Op.or]: [
//                   { projectName: { [Op.like]: `%${searchTerm}%` } },
//                   // { state: { [Op.like]: `%${searchTerm}%` } },
//                   { location: { [Op.like]: `%${searchTerm}%` } },
//                 ],
//               }
//             : undefined, 
//         },
//         { model: WorkDone, as: "workDone" },
//         { model: MaterialOnSite, as: "materialOnSite" },
//         { model: DieselReport, as: "dieselReport" },
//         { model: LaborReport, as: "laborReport" },
//         { model: DailyExpense, as: "dailyExpense" },
//       ],
//       order: [["date", "DESC"]],
//       limit,
//       offset,
//     });

    // successResponse(res, "Daily progress reports fetched successfully", {
    //   reports: rows,
    //   pagination: {
    //     totalRecords: count,
    //     totalPages: Math.ceil(count / limit),
    //     currentPage: page,
    //     itemsPerPage: limit,
    //   },
    // });
//   } catch (error) {
//     console.log(error);
//     errorResponse(res);
//   }
// };

exports.getDprs = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { projectId, searchTerm } = req.query;

    const { role, id: userId } = req.user; 

    const whereCondition = {};

    if (role === "PROJECT_MANAGER" || role ==="SITE_MANAGER" || role ==="FINANCE_MANAGER") {
      const participantProjects = await Participant.findAll({
        where: { userId },
        attributes: ["projectId"],
      });
      const projectIds = participantProjects.map((p) => p.projectId);

      whereCondition.projectId = projectIds;
    }

    if (projectId) {
      whereCondition.projectId = projectId;
    }

    if (searchTerm) {
      whereCondition[Op.or] = [
        { nameOfSupervisor: { [Op.like]: `%${searchTerm}%` } },
       
        { "$project.projectName$": { [Op.like]: `%${searchTerm}%` } },
        { "$project.location$": { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { rows, count } = await Dpr.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["id", "projectName", "location"],
        },
        { model: WorkDone, as: "workDone" },
        { model: MaterialOnSite, as: "materialOnSite" },
        { model: DieselReport, as: "dieselReport" },
        { model: LaborReport, as: "laborReport" },
        { model: DailyExpense, as: "dailyExpense" },
      ],
      order: [["date", "DESC"]],
      limit,
      offset,
      subQuery: false, // important when using $association.field$ in where
    });

     successResponse(res, "Daily progress reports fetched successfully", {
      reports: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch DPRs",
      error: error.message,
    });
  }
};

exports.getDprById = async (req, res) => {
  try {
    const dpr = await Dpr.findByPk(req.params.id, {
      include: [
        "workDone",
        "materialOnSite",
        "dieselReport",
        "laborReport",
        "dailyExpense",
        "photos",
      ],
    });
    const photos = dpr.photos.map((item) => ({
      fileName: item.fileName,
      photo: item.photo.toString("utf-8"),
    }));
    dpr.photos = photos;
    successResponse(res, "Daily progress fetch successfully.", dpr);
  } catch (error) {
    errorResponse(res);
  }
};

exports.getDprsByProjectId = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams(req.query);
    const { searchTerm } = req.query;
    const { projectId } = req.params;

    if (!projectId) {
      return errorResponse(res, "Project ID is required", 400);
    }

    const whereCondition = { projectId };

    if (searchTerm) {
      whereCondition[Op.or] = [
        { nameOfSupervisor: { [Op.like]: `%${searchTerm}%` } },
        { "$project.projectName$": { [Op.like]: `%${searchTerm}%` } },
        { "$project.location$": { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { rows, count } = await Dpr.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Project, as: "project", attributes: ["id", "projectName", "location"] },
        { model: WorkDone, as: "workDone" },
        { model: MaterialOnSite, as: "materialOnSite" },
        { model: DieselReport, as: "dieselReport" },
        { model: LaborReport, as: "laborReport" },
        { model: DailyExpense, as: "dailyExpense" },
      ],
      distinct: true,
      order: [["date", "DESC"]],
      limit,
      offset,
      subQuery: false,
    });

    successResponse(res, "Daily progress reports fetched successfully", {
      reports: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch DPRs", 500);
  }
};

exports.changeStatusOfDPR = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return errorResponse(res, "DPR ID and status are required", 400);
    }


    if (!["approved", "rejected"].includes(status)) {
      return errorResponse(
        res,
        "DPR status must be either 'approved' or 'rejected'",
        400
      );
    }

    const dprData = await Dpr.findByPk(id);

    if (!dprData) {
      return errorResponse(res, "DPR not found", 404);
    }

    if (dprData.status !== "pending") {
      return errorResponse(res, `DPR already processed (${dprData.status})`, 400);
    }

    if (dprData.status === status) {
      return errorResponse(
        res,
        `DPR status is already ${status}`,
        400
      );
    }

    dprData.status = status;
    await dprData.save();

    return successResponse(
      res,
      `DPR ${status} successfully`,
      dprData
    );
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Failed to approve or reject DPR",
      500
    );
  }
};

