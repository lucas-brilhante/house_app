const { Sequelize, DataTypes } = require("sequelize");
const connection = require("../database/connection");
const House = require("../models/house");

const HouseImages = connection.define(
  "HouseImages",
  {
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = HouseImages;
