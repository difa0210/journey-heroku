"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Journey.belongsTo(models.User, {
        as: "User",
        foreignKey: {
          name: "userId",
        },
      });

      Journey.hasMany(models.Bookmark, {
        as: "Bookmark",
        foreignKey: {
          name: "journeyId",
        },
      });
    }
  }
  Journey.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Journey",
    }
  );
  return Journey;
};
