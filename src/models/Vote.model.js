const { DataTypes } = require('sequelize');
const sequelize = require('../util/dbConfig');

const Vote = sequelize.define(
  'vote',
  {
    // Decision of the user on the poll
    decision: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    power: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Foreign Key to the user table
    // Foreign Key to the poll table
  },
  {
    timestamps: true,
  },
);

module.exports = Vote;
