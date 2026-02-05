const { fn, col, literal,Op, } = require("sequelize");
const {
  ProjectMaterial,
  MaterialTransaction,
  Project,
  CompanyMaterial,
  Participant,
  sequelize,
} = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

exports.addMaterialTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { projectId, materialId, transactionType, quantity, challanNumber } =
      req.body;
    
    const challan = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const imageContentType= req.file ? req.file.mimetype : null;

    const project = await Project.findByPk(projectId, { transaction: t });
    if(!project) {
      await t.rollback();
      return errorResponse(res, "Project not found", 400);
    }

    let companyMaterial = await CompanyMaterial.findByPk(materialId, { transaction: t });
    if(!companyMaterial) {
      await t.rollback();
      return errorResponse(res, "Material not found", 400);
    }

    let [projectMaterial] = await ProjectMaterial.findOrCreate({
      where: { projectId, materialId },
      transaction: t,
    });

    if(transactionType==="issue"){
    if (companyMaterial.available_quantity < quantity) {
      await t.rollback();
      return errorResponse(res, "Not enough material in stock", 400);
    }
    }

    if(transactionType === "receive") {
      const transactions = await MaterialTransaction.findAll({
        where: { projectMaterialId: projectMaterial.id }
      });

      if (!transactions || transactions.length === 0) {
        await t.rollback();
        return errorResponse(res, "Material not issue yet", 400);
      }

      let totalReceived = 0;
      let totalIssued = 0;

      transactions.forEach((tx) => {
        if (tx.transactionType === "receive") totalReceived += tx.quantity;
        if (tx.transactionType === "issue") totalIssued += tx.quantity;
      });

      const availableToRecieved = totalIssued - totalReceived;

      if (quantity > availableToRecieved) {
        await t.rollback();
        return errorResponse(
          res,
          `Received material quantity is greater than issued quantity (${availableToRecieved})`,
          400
        );
      }
    }

    if(transactionType === "return") {
      const transactions = await MaterialTransaction.findAll({
        where: { projectMaterialId: projectMaterial.id }
      });

      if (!transactions || transactions.length === 0) {
        await t.rollback();
        return errorResponse(res, "Material not received yet", 400);
      }

      let totalReceived = 0;
      let totalReturned = 0;

      transactions.forEach((tx) => {
        if (tx.transactionType === "receive") totalReceived += tx.quantity;
        if (tx.transactionType === "return") totalReturned += tx.quantity;
      });

      const availableToReturn = totalReceived - totalReturned;

      if (quantity > availableToReturn) {
        await t.rollback();
        return errorResponse(
          res,
          `Return material quantity is greater than received quantity (${availableToReturn})`,
          400
        );
      }
    }

    const transaction = await MaterialTransaction.create(
      {
      projectMaterialId: projectMaterial.id,
      transactionType,
      quantity,
      challanNumber,
      challan,
      imageContentType,
      },
      { transaction: t }
    );

    if(transactionType==="issue"){
      await projectMaterial.increment(
        { assigned_quantity: quantity },
        { transaction: t }
      );
      await companyMaterial.decrement(
        {available_quantity: quantity},
        { transaction: t }
      );
    }

    if(transactionType==="return"){
      await companyMaterial.increment(
        {available_quantity: quantity},
        { transaction: t }
      );
    }

    await t.commit();
    successResponse(res, "Transaction recorded successfully", transaction);
  } catch (error) {
    await t.rollback();
    console.error(error);
    errorResponse(res, "Failed to record transaction", 500);
  }
};

exports.getProjectMaterials = async (req, res) => {
  try {
    const { page, limit, offset, searchTerm } = validateQueryParams({
      ...req.query,
    });

    const where = {};
    if (searchTerm) {
      where.material = { [Op.like]: `%${searchTerm}%` };
    }

    const { rows, count } = await ProjectMaterial.findAndCountAll({
      where,
      attributes: [
        "id",
        "materialId",
        [fn("SUM", col("transactions.quantity")), "totalQuantity"],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN transactions.transactionType = 'receive' THEN transactions.quantity ELSE 0 END`
            )
          ),
          "totalReceived",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN transactions.transactionType = 'issue' THEN transactions.quantity ELSE 0 END`
            )
          ),
          "totalIssued",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN transactions.transactionType = 'return' THEN transactions.quantity ELSE 0 END`
            )
          ),
          "totalReturned",
        ],
        [fn("MAX", col("transactions.createdAt")), "lastTransactionDate"],
        [
          literal(`
            SUM(
              CASE 
                WHEN transactions.transactionType = 'issue' THEN transactions.quantity
                WHEN transactions.transactionType = 'receive' THEN transactions.quantity
                WHEN transactions.transactionType = 'return' THEN -transactions.quantity
                ELSE 0 
              END
            )
          `),
          "currentStock",
        ],
      ],
      include: [
        {
          model: CompanyMaterial,
          as: "material",
          attributes: ["id", "materialName","available_quantity"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["id", "projectName"],
        },
        {
          model: MaterialTransaction,
          as: "transactions",
          attributes: [],
        },
      ],
      group: ["ProjectMaterial.id", "project.id"],
      limit,
      offset,
      order: [[fn("MAX", col("transactions.createdAt")), "DESC"]],
      subQuery: false,
    });

    successResponse(res, "Project materials fetched successfully", {
      materials: rows,
      pagination: {
        totalRecords: count.length || count,
        totalPages: Math.ceil((count.length || count) / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch project materials", 500);
  }
};

//search remaining
// exports.getAllMaterialTransactions = async (req, res) => {
//   try {
//     const { page, limit, offset } = validateQueryParams({ ...req.query });
//     // const { role, id: userId } = req.user;
//     // const whereCondition = {};

//     // if (role === "PROJECT_MANAGER" || role ==="SITE_MANAGER" || role ==="FINANCE_MANAGER") {
//     //   const participantProjects = await Participant.findAll({
//     //     where: { userId },
//     //     attributes: ["projectId"],
//     //   });
//     //   const projectIds = participantProjects.map((p) => p.projectId);

//     //   whereCondition.projectId = projectIds;
//     // }

//     // if (projectId) {
//     //   whereCondition.projectId = projectId;
//     // }
//     const { count, rows } = await MaterialTransaction.findAndCountAll({
//       // where: whereCondition,
//       attributes: { exclude: ["challan"] },
//       include: [
//         {
//           model: ProjectMaterial,
//           as: "projectMaterial",
//           attributes: ["projectId", "materialId","assigned_quantity"],
//           include: [
//             {
//               model: Project,
//               as: "project",
//               attributes: ["id", "projectName"],
//             },
//             {
//               model: CompanyMaterial,
//               as: "material",
//               attributes: ["id", "materialName","available_quantity"],
//             },
//           ],
//         },
//       ],
//       limit,
//       offset,
//       order: [["createdAt", "DESC"]],
//     });

//     successResponse(res, "Transactions fetched successfully.", {
//       transactions: rows,
//       pagination: {
//         totalRecords: count,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         itemsPerPage: limit,
//       },
//     });
//   } catch (error) {
//     errorResponse(res, "Failed to fetch transactions");
//   }
// };

exports.getAllMaterialTransactions = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { projectId } = req.query;
    const { role, id: userId } = req.user;

    const projectMaterialWhere = {};

    if (
      role === "PROJECT_MANAGER" ||
      role === "SITE_MANAGER" ||
      role === "FINANCE_MANAGER"
    ) {
      const participantProjects = await Participant.findAll({
        where: { userId },
        attributes: ["projectId"],
      });

      // console.log("participantProjects",participantProjects);
      

      const projectIds = participantProjects.map((p) => p.projectId);

      if (!projectIds.length) {
        return successResponse(res, "No transactions found", {
          transactions: [],
          pagination: {
            totalRecords: 0,
            totalPages: 0,
            currentPage: page,
            itemsPerPage: limit,
          },
        });
      }

      projectMaterialWhere.projectId = projectIds;
    }

    // 🔎 Optional project filter
    if (projectId) {
      projectMaterialWhere.projectId = projectId;
    }

    const { count, rows } = await MaterialTransaction.findAndCountAll({
      attributes: { exclude: ["challan"] },
      include: [
        {
          model: ProjectMaterial,
          as: "projectMaterial",
          where: projectMaterialWhere,
          attributes: ["projectId", "materialId", "assigned_quantity"],
          include: [
            {
              model: Project,
              as: "project",
              attributes: ["id", "projectName"],
            },
            {
              model: CompanyMaterial,
              as: "material",
              attributes: ["id", "materialName", "available_quantity"],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true, // IMPORTANT for correct count
    });

    successResponse(res, "Transactions fetched successfully.", {
      transactions: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch transactions");
  }
};

exports.getAllProjectsWithMaterialsDetails = async (req, res) => {
  try {
    const { page, limit, offset, searchTerm } = validateQueryParams({ ...req.query });

    // Optional search filter on material name
    const materialWhere = {};
    if (searchTerm) {
      materialWhere.materialName = { [Op.like]: `%${searchTerm}%` };
    }

    const projects = await Project.findAndCountAll({
      attributes: ["id", "projectName"],
      include: [
        {
          model: ProjectMaterial,
          as: "projectMaterials",
          attributes: [
            "id","projectId",
            "assigned_quantity",
            "materialId",
            // [
            //   literal(`
            //     SUM(
            //       CASE 
            //         WHEN materials->transactions.transactionType = 'receive' THEN materials->transactions.quantity
            //         WHEN materials->transactions.transactionType = 'issue' THEN -materials->transactions.quantity
            //         WHEN materials->transactions.transactionType = 'return' THEN -materials->transactions.quantity
            //         ELSE 0
            //       END
            //     )
            //   `),
            //   "currentStock",
            // ],
            // [
            //   literal(`
            //     SUM(
            //       CASE 
            //         WHEN \`projectMaterials->transactions\`.\`transactionType\` = 'receive'
            //           THEN \`projectMaterials->transactions\`.\`quantity\`
            //         WHEN \`projectMaterials->transactions\`.\`transactionType\` = 'issue'
            //           THEN -\`projectMaterials->transactions\`.\`quantity\`
            //         WHEN \`projectMaterials->transactions\`.\`transactionType\` = 'return'
            //           THEN \`projectMaterials->transactions\`.\`quantity\`
            //         ELSE 0
            //       END
            //     )
            //   `),
            //   "currentStock",
            // ],
            // [
            //   fn(
            //     "SUM",
            //     literal(`CASE WHEN materials->transactions.transactionType = 'receive' THEN materials->transactions.quantity ELSE 0 END`)
            //   ),
            //   "totalReceived",
            // ],
            // [
            //   fn(
            //     "SUM",
            //     literal(`CASE WHEN materials->transactions.transactionType = 'issue' THEN materials->transactions.quantity ELSE 0 END`)
            //   ),
            //   "totalIssued",
            // ],
            // [
            //   fn(
            //     "SUM",
            //     literal(`CASE WHEN materials->transactions.transactionType = 'return' THEN materials->transactions.quantity ELSE 0 END`)
            //   ),
            //   "totalReturned",
            // ],
          ],
          include: [
            {
              model: CompanyMaterial,
              as: "material",
              attributes: ["id", "materialName", "available_quantity"],
              where: materialWhere, 
            },
            {
              model: MaterialTransaction,
              as: "transactions",
              // attributes: [],
            },
          ],
          group: ["ProjectMaterial.id", "material.id"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      subQuery: false,
    });

    successResponse(res, "Projects with materials fetched successfully", {
      projects: projects.rows,
      pagination: {
        totalRecords: projects.count,
        totalPages: Math.ceil(projects.count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch projects", 500);
  }
};

exports.getTransactionsById = async (req,res) =>{
try{
  const {id} = req.params;
  if (!id) {
    return errorResponse(res, "ID is required", 400);
  }

  const transaction = await MaterialTransaction.findOne({
    where: { id: id },
    include: [
      {
          model: ProjectMaterial,
          as: "projectMaterial",
          attributes: ["projectId", "materialId"],
          include: [
            {
              model: Project,
              as: "project",
              attributes: ["id", "projectName"],
            },
            {
              model: CompanyMaterial,
              as: "material",
              attributes: ["id", "materialName","available_quantity"],
            },
          ],
      },
    ],
  });

  if (!transaction) {
    return errorResponse(res, "transaction not found", 404);
  }

  let challanBase64 = null;
    if (transaction.challan && transaction.imageContentType) {
      challanBase64 = `data:${transaction.imageContentType};base64,${transaction.challan.toString(
        "base64"
      )}`;
    }

    return successResponse(res, "Transaction details fetched successfully", {
      ...transaction.toJSON(),
      challan: challanBase64,
      challanContentType: transaction.imageContentType,
    });
    
} catch (error) {
    errorResponse(res, "Failed to fetch transactions");
  }
};

// exports.getMaterialsAndTransactionsByProjectId = async (req, res) => {
//   try {
//     const { page, limit, offset } = validateQueryParams({ ...req.query });
//     const { projectId } = req.params;

//     if (!projectId) {
//       return errorResponse(res, "Project ID is required", 400);
//     }

//     const { count, rows } = await ProjectMaterial.findAndCountAll({
//       where: { projectId },
//       attributes: [
//         "id",
//         "projectId",
//         "materialId",
//         "assigned_quantity",
//       ],
//       include: [
//         {
//           model: CompanyMaterial,
//           as: "material",
//           attributes: ["id", "materialName", "available_quantity"],
//         },
//         {
//           model: MaterialTransaction,
//           as: "transactions",
//           attributes: [
//             "id",
//             "transactionType",
//             "quantity",
//             "challanNumber",
//             "createdAt",
//           ],
//           order: [["createdAt", "DESC"]],
//         },
//       ],
//       limit,
//       offset,
//     });

//     const result = rows.map((pm) => {
//       let totalReceived = 0;
//       let totalIssued = 0;
//       let totalReturned = 0;

//       (pm.transactions || []).forEach((tx) => {
//         if (tx.transactionType === "receive") totalReceived += tx.quantity;
//         if (tx.transactionType === "issue") totalIssued += tx.quantity;
//         if (tx.transactionType === "return") totalReturned += tx.quantity;
//       });

//       const totalUsed = totalIssued - totalReturned;
//       return {
//         ...pm.toJSON(),
//         totals: {
//           totalReceived,
//           totalIssued,
//           totalReturned,
//           totalUsed,
//         },
//       };
//       });


//     successResponse(
//       res,
//       "Materials and transactions fetched successfully",{
//         materials:result,
//         pagination: {
//           totalRecords: result.length,
//           totalPages: Math.ceil(result.length / limit),
//           currentPage: page,
//           itemsPerPage: limit,
//         },
//     }
//     );
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, "Failed to fetch project materials", 500);
//   }
// };


exports.getMaterialsAndTransactionsByProjectId = async (req, res) => {
  try {
    //search remaining
    const { page, limit, offset ,searchTerm} = validateQueryParams({ ...req.query });
    const { projectId } = req.params;

    const where = {};
    if (searchTerm) {
      // where.material = { [Op.like]: `%${searchTerm}%` };
    }

    if (!projectId) {
      return errorResponse(res, "Project ID is required", 400);
    }

    const { count, rows } = await ProjectMaterial.findAndCountAll({
      where: { projectId },
      attributes: ["id", "projectId", "materialId", "assigned_quantity"],
      include: [
        {
          model: CompanyMaterial,
          as: "material",
          attributes: ["id", "materialName", "available_quantity"],
        },
        {
          model: MaterialTransaction,
          as: "transactions",
          attributes: [
            "id",
            "transactionType",
            "quantity",
            "challanNumber",
            "createdAt",
          ],
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    const result = rows.map((pm) => {
      let totalReceived = 0;
      let totalIssued = 0;
      let totalReturned = 0;

      (pm.transactions || []).forEach((tx) => {
        if (tx.transactionType === "receive") totalReceived += tx.quantity;
        if (tx.transactionType === "issue") totalIssued += tx.quantity;
        if (tx.transactionType === "return") totalReturned += tx.quantity;
      });

      const totalUsed = totalReceived - totalReturned;

      return {
        ...pm.toJSON(),
        totals: {
          totalReceived,
          totalIssued,
          totalReturned,
          totalUsed,
        },
      };
    });

    successResponse(res, "Materials and transactions fetched successfully", {
      materials: result,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch project materials", 500);
  }
};
