const { Op } = require("sequelize");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
const { createError } = require("../../utils/error");

exports.createUser = async (name, email, mobileNumber, password, role, req) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw createError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create(
    {
      name,
      email,
      password: hashedPassword,
      role,
      mobileNumber,
    },
    { req }
  );

  delete user["password"];

  return user;
};

exports.findUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw createError("User not found.", 404);
  }
  return user;
};

exports.getAllUsers = async () => {
  return await User.findAll({
    where: {
      role: {
        [Op.ne]: "ADMIN",
      },
    },
    attributes: { exclude: ["password"] },
  });
};

exports.updateUser = async (id, name, email, mobileNumber, req) => {
  const user = await this.findUser(id);
  if (email && user.email != email) {
    const isExists = await User.findOne({
      where: {
        email,
      },
    });
    if (isExists) {
      throw createError("Email already in use", 400);
    }
  }
  user.name = name;
  user.email = email;
  user.mobileNumber = mobileNumber;

  await user.save({ req });

  return user;
};

exports.changeStatus = async (id, req) => {
  const user = await this.findUser(id);
  user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await user.save({ req });
  return user;
};
