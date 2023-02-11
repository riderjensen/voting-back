const Poll = require('../models/Poll.model');
const User = require('../models/User.model');
const Vote = require('../models/Vote.model');

exports.getUser = async (req, res) => {
  const { id } = req;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (user) {
    return res.status(200).send(user);
  }
  return res.status(500).send({ error: "There is no user with this ID" });
};

exports.getUserVotes = async (req, res) => {
  const { id } = req;

  const user = await Vote.findAll({
    where: {
      userId: id,
    },
    include: Poll,
  });

  if (user) {
    return res.status(200).send(user);
  }
  return res.status(500).send({ error: "There is no user with this ID" });
};
