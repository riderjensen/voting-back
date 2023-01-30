const Poll = require('../models/Poll.model');
const Vote = require('../models/Vote.model');
const { pollClean } = require('../util/polls');

exports.getAllPolls = async (req, res) => {
  const { id } = req;

  let polls;
  if (id) {
    polls = await Poll.findAll({
      order: [['closes', 'DESC']],
      include: {
        model: Vote,
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
  if (!optionOne || !optionTwo) return res.status(500).send('Two options must be provided');

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

exports.openPoll = async (req, res) => {
  await Poll.update(
    {
      open: true,
    },
    {
      where: {
        id: req.params.id,
      },
    },
  );
  return res.status(200).send('Poll opened');
};

exports.closePoll = async (req, res) => {
  const poll = await Poll.findOne({
    where: {
      id: req.params.id,
    },
  });

  const pollResults = [
    {
      count: poll.c1,
      id: 1,
    },
    {
      count: poll.c2,
      id: 2,
    },
    {
      count: poll.c3,
      id: 3,
    },
    {
      count: poll.c4,
      id: 4,
    },
    {
      count: poll.c5,
      id: 5,
    },
  ];

  pollResults.sort((a, b) => b.count - a.count);

  poll.set('open', false);
  poll.set('result', pollResults[0].id);
  const savedPoll = await poll.save();
  return res.status(200).send(savedPoll);
};
