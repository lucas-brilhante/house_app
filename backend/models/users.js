const { Sequelize, DataTypes } = require("sequelize");
const connection = require("../database/connection");

const User = connection.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = User;
