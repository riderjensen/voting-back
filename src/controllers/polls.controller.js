const path = require('node:path');
const { fork } = require('child_process');
const Poll = require('../models/Poll.model');
const User = require('../models/User.model');
const Vote = require('../models/Vote.model');
const { pollClean, pollDecide } = require('../util/polls');
const { createTimeout } = require('../util/pollCloseQueue');

exports.getAllPolls = async (req, res) => {
  const { id } = req;

  let polls;
  if (id) {
    polls = await Poll.findAll({
      order: [['closes', 'DESC']],
      include: {
        model: Vote,
        required: false,
        where: {
          userId: id,
        },
      },
    });
  } else {
    polls = await Poll.findAll({
      order: [['closes', 'DESC']],
    });
  }

  const returnedPolls = [];
  polls.forEach((poll) => {
    const newPoll = pollClean(poll);
    returnedPolls.push(newPoll);
  });
  return res.status(200).send(returnedPolls);
};

exports.createPoll = async (req, res, next) => {
  const {
    question, time, optionOne, optionTwo, optionThree, optionFour, optionFive,
  } = req.body;

  if (!question) return res.status(500).send('No question');
  if (!optionOne || !optionTwo) return res.status(500).send({ error: "Two options must be provided" });

  const poll = await Poll.create({
    question,
    // Defaults to one week
    closes: parseInt(new Date().getTime() + (time ?? 604800000), 10),
    o1: optionOne,
    o2: optionTwo,
    o3: optionThree,
    o4: optionFour,
    o5: optionFive,
  });
  if (poll) {
    return res.status(201).send(poll);
  }
  return next();
};

exports.openPoll = async (req, res, next) => {
  const poll = await Poll.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (poll) {
    const { closes, id } = poll;
    poll.open = true;
    await poll.save();
    // Creates a timeout to close the poll in the future
    createTimeout(closes, id);
    const users = await User.findAll({
      where: {
        newsletter: true,
      },
    });

    const child = fork(path.join(__dirname, '..', 'emails', 'poll.email'));

    child.send({ users, title: poll.question });

    return res.status(200).send({ message: "Poll opened, email campaign beginning" });
  } else {
    return next();
  }
};

// Should be handled by our set timeout work, used for manually closing a poll
exports.closePoll = async (req, res, next) => {
  const poll = await Poll.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (poll) {

    const pollResults = pollDecide(poll);

    poll.set('open', false);
    poll.set('result', pollResults[0].id);
    const savedPoll = await poll.save();
    return res.status(200).send(savedPoll);
  } else {
    return next();
  }
};
