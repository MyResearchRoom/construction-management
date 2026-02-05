"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

/**
 * 1️⃣ Load models from the current folder (optional)
 */
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

/**
 * 2️⃣ Load models dynamically from each module folder
 *    Example structure:
 *    modules/
 *      user/user.model.js
 *      project/project.model.js
 */
const modulesPath = path.join(__dirname, "../modules");

if (fs.existsSync(modulesPath)) {
  const moduleFolders = fs.readdirSync(modulesPath);

  moduleFolders.forEach((moduleName) => {
    const modelsDir = path.join(modulesPath, moduleName);

    if (fs.existsSync(modelsDir)) {
      fs.readdirSync(modelsDir)
        .filter((file) => file.endsWith(".model.js"))
        .forEach((file) => {
          const modelPath = path.join(modelsDir, file);
          const model = require(modelPath)(sequelize, Sequelize.DataTypes);
          db[model.name] = model;
        });
    }
  });
}

/**
 * 3️⃣ Run associations if defined
 */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
