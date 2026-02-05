const { login } = require("./auth.service");
const { generateTokens, decodeRefreshToken } = require("../../utils/token");
const {
  createRefreshToken,
  validate,
  deleteRefreshToken,
} = require("../refreshToken/refreshToken.service");
const { errorResponse, successResponse } = require("../../utils/response");
const {UserPermission,Permission} = require("../../models")
const { findUser } = require("../user/user.service");
const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);

    const { accessToken, refreshToken } = generateTokens(user);

    await createRefreshToken(user.id, refreshToken, req);

    let permissions;
    if (user.role !== "ADMIN") {
      permissions = await UserPermission.findAll({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          model: Permission,
          as: "permission",
        },
      });
      permissions = permissions.map((perm) => perm.permission.name);
    }

    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

    successResponse(res, "Login successful", {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email:user.email,
        mobileNumber:user.mobileNumber
      },
      accessRoute: permissions,
    });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    await validate(refreshToken);

    const decoded = decodeRefreshToken(refreshToken);

    const user = await findUser(decoded.id);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    await deleteRefreshToken(refreshToken, req);
    await createRefreshToken(user.id, newRefreshToken, req);

    let permissions=[];
    if (user.role !== "ADMIN") {
      permissions = await UserPermission.findAll({
        where: {
          userId: user.id,
          isActive: true,
        },
        include: {
          model: Permission,
          as: "permission",
        },
      });
      permissions = permissions.map((perm) => perm.permission.name);
    }
    console.log("permission",permissions);

    res.cookie(COOKIE_NAME, newRefreshToken, COOKIE_OPTIONS);

    successResponse(res, "Token refresh successful......", {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email:user.email,
        mobileNumber:user.mobileNumber
      },
      accessRoute: permissions,
    });
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await deleteRefreshToken(refreshToken, req);
      res.clearCookie("refreshToken");
    }
    successResponse(res, "Logged out successfully");
  } catch (err) {
    errorResponse(res, err.message, err.statusCode || 500);
  }
};
