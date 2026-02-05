const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SitePhoto extends Model {}

  SitePhoto.init(
    {
      dprId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "site_photos",
      timestamps: false,
    }
  );

  return SitePhoto;
};
