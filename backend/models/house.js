const { Sequelize, DataTypes } = require("sequelize");
const connection = require("../database/connection");

const House = connection.define("House", {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    /*validate: {
      len: {
        args: [1, 255],
        msg: "Endereço Inválido.",
      },
    },*/
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    /*validate: {
      len: {
        args: [1, 20],
        msg: "Número inválido.",
      },
    },*/
  },
});

module.exports = House;
