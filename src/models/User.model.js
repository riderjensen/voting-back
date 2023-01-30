const { DataTypes } = require('sequelize');
const sequelize = require('../util/dbConfig');

const User = sequelize.define(
  'user',
  {
    // Unique ID for the account
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    // The login email of the user
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // The password of the user
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codeTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // The admin status of the user
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    // How much voting power the user has
    power: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    // Newsletter signup
    newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = User;
