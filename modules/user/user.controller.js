const { errorResponse, successResponse } = require("../../utils/response");
const {
  createUser,
  getAllUsers,
  updateUser,
  changeStatus,
} = require("./user.service");
const { User ,Permission} = require("../../models");
const bcrypt = require("bcrypt");
const DEFAULT_PERMISSIONS = [
  "HOME",
  "TENDERS",
  "PROJECTS",
  "DPR",
  "DPR_REQUEST",
  "MATERIALS",
  "FUEL_AND_VEHICLE",
  "LABOUR",
  "REPORTS",
  "EXPENSE",
];

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobileNumber } = req.body;
    const user = await createUser(
      name,
      email,
      mobileNumber,
      password,
      role,
      req
    );

    if (role === "ADMIN") {
      const permissionCount = await Permission.count();

      if (permissionCount === 0) {
        const permissionRecords = DEFAULT_PERMISSIONS.map((name) => ({
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await Permission.bulkCreate(permissionRecords);
      }
    }

    user.password = "";
    successResponse(res, "User created successfully", user);
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    successResponse(res, "User list fetch successfully.", users);
  } catch (error) {
    errorResponse(res, "Failed to fetch user list", 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;
    const user = await updateUser(
      req.params.id,
      name,
      email,
      mobileNumber,
      req
    );
    user.password = "";
    successResponse(res, "User updated successfully", user);
  } catch (error) {
    errorResponse(res, error.message, error.statusCode || 500);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const user = await changeStatus(req.params.id, req);
    successResponse(res, "User status updated successfully", {
      status: user.status,
    });
  } catch (err) {
    errorResponse(err, err.message, err.statusCode || 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, "user ID is required", 400);
    }

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!User) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(
      res,
      "User details fetched successfully....",
      user
    );
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return errorResponse(res);
  }
};

exports.getAllProjectManagers = async (req, res) => {
  try {
    const projectManagers = await User.findAll({
      where: {
        role: "PROJECT_MANAGER",
        status: "ACTIVE", 
      },
      attributes: {
        exclude: ["password"], 
      },
    });
    // console.log("project manager list",projectManagers);
    successResponse(res, "Project manager list fetch successfully.", projectManagers);
  } catch (error) {
    errorResponse(res, "Failed to fetch user list", 500);
  }
};

exports.getAllSiteManagers = async (req, res) => {
  try {
    const siteManagers = await User.findAll({
      where: {
        role: "SITE_MANAGER",
        status: "ACTIVE", 
      },
      attributes: {
        exclude: ["password"], 
      },
    });
    successResponse(res, "Site manager list fetch successfully.", siteManagers);
  } catch (error) {
    errorResponse(res, "Failed to fetch user list", 500);
  }
};

exports.getAllFinanaceManagers = async (req, res) => {
  try {
    const finanaceManagers = await User.findAll({
      where: {
        role: "FINANCE_MANAGER",
        status: "ACTIVE", 
      },
      attributes: {
        exclude: ["password"], 
      },
    });
    successResponse(res, "Finance manager list fetch successfully.", finanaceManagers);
  } catch (error) {
    errorResponse(res, "Failed to fetch user list", 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { oldPassword, newPassword } = req.body;
    // console.log("oldPassword, newPassword",oldPassword, newPassword);
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findByPk(id, 
    {
      attributes: ["id", "password"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    successResponse(res, "Password changed successfully");

  } catch (error) {
    // console.log(error);
    
    errorResponse(res, "Failed to change password", 500);
  }
};