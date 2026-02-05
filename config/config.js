require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  },
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  forgot_password_jwt_secret: process.env.FORGOT_PASSWORD_JWT_SECRET,
  port: process.env.PORT || 8000,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  clientUrl: process.env.CLIENT_URL,
};
