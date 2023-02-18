const Poll = require("../models/Poll.model");
const { pollDecide } = require("./polls");

const pollCloseQueue = async () => {
  const polls = await Poll.findAll({
    where: {
      open: true,
    }
  });

  polls.forEach(poll => {
    createTimeout(poll.closes, poll.id);
  });
}

const createTimeout = (closes, id) => {
  setTimeout(async () => {
    // Find the poll again because the state of the poll has changed
    const poll = await Poll.findOne({
      where: {
        id
      }
    })
    const pollResults = pollDecide(poll);
    poll.set('open', false);
    poll.set('result', pollResults[0].id);
    await poll.save();
  }, closes - new Date().getTime());
  console.log('setTimeout created');
}

exports.createTimeout = createTimeout;
exports.pollCloseQueue = pollCloseQueue;