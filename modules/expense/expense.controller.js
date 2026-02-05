const { Op } = require("sequelize");
const { Category,Expense,Project,User,Participant } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/response");
const { validateQueryParams } = require("../../utils/validateQueryParams");

const generateExpenseId = async () => {
  const year = new Date().getFullYear();
  const count = await Expense.count();
  const next = (count + 1).toString().padStart(3, "0");
  return `EXP-${year}-${next}`;
};

exports.saveExpenseData = async(req,res)=>{
 try{
    const expenseId = await generateExpenseId();

    const {projectId,categoryId,amount,gst,description} =req.body;

    const expenseData = {
      expenseId,
      projectId,
      categoryId,
      submittedBy: req.user.id,
      amount,
      gst : gst ? gst : 0,
      description : description ? description : null,
      receipt: req.file ? req.file.buffer : null,
      imageContentType: req.file
        ? req.file.mimetype
        : null,
    };

    const expense = await Expense.create(expenseData);
    successResponse(res, "Expenses added successfully", expense);

  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};

exports.getAllExpenseData = async (req, res) => {
  try {
    const { page, limit, offset } = validateQueryParams({ ...req.query });
    const { searchTerm ,status} = req.query;
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
        { '$expenseCategory.categoryName$': { [Op.like]: `%${searchTerm}%` } },
        { '$projectExpenses.projectName$': { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        // { status: { [Op.like]: `%${status}%` } }, 
      ];
    }

    if (status) {
      whereClause.status = status; 
    }

    const { count, rows } = await Expense.findAndCountAll({
      where: whereClause,
      include:[
        {
          model:Project,
          as:"projectExpenses",
          attributes:["id","projectId","projectName","client","budget"],       
        },
        {
          model:Category,
          as:"expenseCategory"
        },
        {
          model:User,
          as:"expenseUsers",
          attributes:["id","name","email","role"],  
        },      
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const expenses = rows.map(expense => {
      const expenseJson = expense.toJSON();

      if (expenseJson.receipt) {
        // expenseJson.receipt = expenseJson.receipt.toString("base64");
        expenseJson.receipt = `data:${expenseJson.imageContentType};base64,${expenseJson.receipt.toString("base64")}`;

      }

      return expenseJson;
    });


    successResponse(res, "Expence fetched successfully", {
      expenses,
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

exports.changeStatusOfExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return errorResponse(res, "Expense ID and status are required", 400);
    }

    if (!["approved", "rejected"].includes(status)) {
      return errorResponse(
        res,
        "Expense status must be either 'approved' or 'rejected'",
        400
      );
    }

    const expenseData = await Expense.findByPk(id);

    if (!expenseData) {
      return errorResponse(res, "Expense not found", 404);
    }

    if (expenseData.status !== "pending") {
      return errorResponse(res, `Expense already processed (${expenseData.status})`, 400);
    }

    if (expenseData.status === status) {
      return errorResponse(
        res,
        `Expense status is already ${status}`,
        400
      );
    }

    expenseData.status = status;
    await expenseData.save();

    return successResponse(
      res,
      `Expense ${status} successfully`,
      expenseData
    );
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Failed to approve or reject Expense",
      500
    );
  }
};

exports.getExpenseDataById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "Expense ID is required", 400);
    }

    const expense = await Expense.findByPk(id, {
      include: [
        {
          model: Project,
          as: "projectExpenses",
          attributes: ["id", "projectId", "projectName", "client", "budget"],
        },
        {
          model: Category,
          as: "expenseCategory",
        },
        {
          model: User,
          as: "expenseUsers",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    if (!expense) {
      return errorResponse(res, "Expense not found", 404);
    }

    const expenseJson = expense.toJSON();

    if (expenseJson.receipt) {
      expenseJson.receipt = `data:${expenseJson.imageContentType};base64,${expenseJson.receipt.toString("base64")}`;
    }

    successResponse(res, "Expense fetched successfully", expenseJson);

  } catch (error) {
    console.log(error);
    errorResponse(res);
  }
};

exports.getProjectMaterialSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return errorResponse(res, "Project ID is required", 400);
    }

    const transactions = await Expense.findAll({
      where: { projectId }, 
      include: [
        {
          model: Project,
          as: "projectExpenses",
        } ,
        {
          model: Category,
          as: "expenseCategory",
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return successResponse(res, "Project material summary fetched successfully", []);
    }

    const materialSummary = {};

    transactions.forEach((tx) => {
      const categoryName= tx.expenseCategory.categoryName || "Uncategorized";;
      const amount = Number(tx.amount || 0); 
      const gstPercent = Number(tx.gst || 0);
      const gstAmount = (amount * gstPercent) / 100;

      if (!materialSummary[categoryName]) {
        materialSummary[categoryName] = {
          categoryName,
          totalAmount: 0,
          totalGST: 0,
          grandTotal: 0,
        };
      }

      materialSummary[categoryName].totalAmount += amount;
      materialSummary[categoryName].totalGST += gstPercent;
      materialSummary[categoryName].grandTotal += amount + gstAmount;
    });

    const result = Object.values(materialSummary);

    return successResponse(res, "Project material summary fetched successfully", result);

  } catch (error) {
    console.log(error);
    errorResponse(res, "Failed to fetch project material summary");
  }
};


