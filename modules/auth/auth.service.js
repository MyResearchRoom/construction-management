const { User } = require("../../models");
const bcrypt = require("bcrypt");
const { createError } = require("../../utils/error");

exports.login = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw createError("Invalid email or password.", 400);
  }

  if (user.status === "INACTIVE") {
    throw createError(
      "User status is 'inactive' can't perform any action.",
      400
    );
  }

  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw createError("Invalid email or password.", 400);
  }

  return user;
};
