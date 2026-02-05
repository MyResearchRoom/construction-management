const { RefreshToken } = require("../../models");
const { createError } = require("../../utils/error");

exports.createRefreshToken = async (userId, token, req) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return await RefreshToken.create(
    { userId, token, expiresAt },
    { userId, req }
  );
};

exports.validate = async (token) => {
  if (!token) {
    throw createError("Please provide valid refresh token.", 400);
  }
  const res = await RefreshToken.findOne({ where: { token } });
  if (!res) {
    throw createError("Invalid refresh token", 400);
  }
};

exports.deleteRefreshToken = async (token, req) => {
  await RefreshToken.destroy({ where: { token }, req });
};
