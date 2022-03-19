"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.Journey, {
        as: "Journey",
        foreignKey: {
          name: "journeyId",
        },
      });

      Bookmark.belongsTo(models.User, {
        as: "User",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  Bookmark.init(
    {
      userId: DataTypes.INTEGER,
      journeyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bookmark",
    }
  );
  return Bookmark;
};
