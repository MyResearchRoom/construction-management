const jwt = require("jsonwebtoken");
const { jwt_secret, jwt_refresh_secret } = require("../config/config");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

exports.generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, jwt_secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id: user.id }, jwt_refresh_secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

exports.decodeAccessToken = (token) => {
  return jwt.verify(token, jwt_secret);
};

exports.decodeRefreshToken = (token) => {
  return jwt.verify(token, jwt_refresh_secret);
};
