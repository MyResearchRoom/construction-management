const { Permission } = require("../../models");

exports.getPermissions = async (req, res) => {
  try {
    const data = await Permission.findAll(); 

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
