const { where } = require("sequelize");
const { Project,Participant,sequelize } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");

// exports.assignProjectManagers = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const { projectManagerId, siteManagerId, financeManagerId } = req.body;
//     console.log("data recived",projectManagerId, siteManagerId, financeManagerId);
    

//     if (!projectId) {
//       return errorResponse(res, "Project ID is required", 400);
//     }

//     const roleMap = {
//       PROJECT_MANAGER: projectManagerId,
//       SITE_MANAGER: siteManagerId,
//       FINANCE_MANAGER: financeManagerId,
//     };

//     for (const [role, userId] of Object.entries(roleMap)) {
//       if (!userId) continue;

//       await Participant.destroy({
//         where: { projectId, role },
//       });

//       await Participant.create({
//         projectId,
//         userId,
//         role,
//       });
      
//     }
//     console.log("saved");
    
//     res.status(200).json({
//       success: true,
//       message: "Project managers updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.assignProjectManagers = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { projectId } = req.params;
    const { projectManagerId, siteManagerId, financeManagerId } = req.body;

    // console.log("data received:", req.body);

    if (!projectId) {
      await transaction.rollback();
      return errorResponse(res, "Project ID is required", 400);
    }

    await Participant.destroy({
      where: { projectId },
      transaction,
    });

    const participants = [];

    if (projectManagerId) {
      participants.push({
        projectId,
        userId: projectManagerId,
        role: "PROJECT_MANAGER",
      });
    }

    if (siteManagerId) {
      participants.push({
        projectId,
        userId: siteManagerId,
        role: "SITE_MANAGER",
      });
    }

    if (financeManagerId) {
      participants.push({
        projectId,
        userId: financeManagerId,
        role: "FINANCE_MANAGER",
      });
    }

    if (participants.length > 0) {
      await Participant.bulkCreate(participants, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Project managers assigned successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAssignedMAnagers = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return errorResponse(res, "Project ID is required", 400);
    }
    const managers= await Participant.findAll({
      where: { projectId},
    })
    return successResponse(
      res,
      "Assigned managers fetched successfully",
      managers
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong", 500);
  }
};

