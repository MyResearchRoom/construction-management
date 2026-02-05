const { UserPermission, Permission, sequelize } = require("../../models");

exports.grantPermission = async (req, res) => {
  const { userId, permissionIds } = req.body;

  if (!userId || !Array.isArray(permissionIds)) {
    return res.status(400).json({
      success: false,
      message: "userId and permissionIds are required",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    await UserPermission.destroy({
      where: { userId },
      transaction,
    });

    if (permissionIds.length === 0) {
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: "All permissions removed",
      });
    }

    const validPermissions = await Permission.findAll({
      where: { id: permissionIds },
      attributes: ["id"],
    });

    if (validPermissions.length !== permissionIds.length) {
      throw new Error("One or more permission names are invalid");
    }

    const newPermissions = permissionIds.map((id) => ({
      userId,
      permissionId: id,
      grantedAt: new Date(),
      isActive: true,
    }));

    await UserPermission.bulkCreate(newPermissions, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Permission granted successfully",
    });

  } catch (error) {
    await transaction.rollback(); 

    return res.status(500).json({
      success: false,
      message: error?.message || "permission not granted",
    });
  }
};

exports.getUserPermissions = async (req, res) => {
try{
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }

    const permissions = await UserPermission.findAll({
        where: { userId, isActive: true },
        include: [
            {
                model: Permission,
                attributes: ["id", "name"],
                as: "permission",
            },
        ],
    });

    const data = permissions.map((permission) => permission.permissionId);

    return res.status(200).json({ 
        data:data, 
        success: true 
    });

}catch (error) {
    return res.status(500).json({ 
        message: error?.message || "Failed to get user permission data", 
        success: false 
    });
  }
};