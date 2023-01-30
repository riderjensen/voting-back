const User = require('../models/User.model');
const Vote = require('../models/Vote.model');
const Poll = require('../models/Poll.model');

async function modelAssociations() {
  Poll.hasMany(Vote, { foreignKey: 'pollId', onDelete: 'CASCADE' });
  Vote.belongsTo(Poll, { foreignKey: 'pollId' });

  User.hasMany(Vote, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Vote.belongsTo(User, { foreignKey: 'userId' });

  await User.sync();
  await Poll.sync();
  await Vote.sync();
}

module.exports = modelAssociations;
