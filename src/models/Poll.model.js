const { DataTypes } = require('sequelize');
const sequelize = require('../util/dbConfig');

const Poll = sequelize.define(
  'poll',
  {
    // The question of the poll
    question: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
    // If the poll is open
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // When the poll closes for votes
    closes: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    // The results of the poll
    result: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    // Option 1
    o1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Count 1
    c1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Option 2
    o2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Count 2
    c2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Option 3
    o3: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // Count 3
    c3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Option 4
    o4: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // Count 4
    c4: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Option 5
    o5: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    // Count 5
    c5: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Poll;
