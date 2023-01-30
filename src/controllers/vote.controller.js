const Poll = require('../models/Poll.model');
const User = require('../models/User.model');
const Vote = require('../models/Vote.model');
const { pollClean } = require('../util/polls');

exports.vote = async (req, res) => {
  const { id } = req;
  const { pollId } = req.params;
  const { decision } = req.body;

  if (!Number.isInteger(decision) || !(decision > 0) || !(decision < 6)) {
    return res.status(500).send('Malformed decision');
  }

  const poll = await Poll.findOne({
    where: {
      id: pollId,
    },
  });

  if (poll?.open) {
    const [user, userVote] = await Promise.all([
      User.findOne({
        where: {
          id,
        },
      }),
      Vote.findOne({
        where: {
          pollId,
          userId: id,
        },
      }),
    ]);
    if (userVote) {
      // The existing vote and values need to be changed
      poll.set(`c${userVote.decision}`, poll[`c${userVote.decision}`] - user.power);
      await userVote.update({
        decision,
      });
    } else {
      await Vote.create({
        decision,
        power: user.power,
        pollId,
        userId: id,
      });
    }
    // Increment the poll results
    poll.set(`c${decision}`, poll[`c${decision}`] + user.power);
    const savedPoll = await poll.save();
    const cleanedPoll = pollClean(savedPoll);
    return res.status(201).send(cleanedPoll);
  }

  return res.status(500).send('You cannot vote in this poll');
};

exports.getVotes = async (req, res) => {
  const { id } = req;

  const votes = await Vote.findAll({
    where: {
      userId: id,
    },
    order: [['pollId', 'DESC']],
  });
  return res.status(200).send(votes);
};
