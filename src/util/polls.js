exports.pollClean = (poll) => {
  const newPoll = {
    closes: poll.closes,
    id: poll.id,
    open: poll.open,
    options: [
      {
        count: poll.c1,
        id: 1,
        option: poll.o1,
      },
      {
        count: poll.c2,
        id: 2,
        option: poll.o2,
      },
    ],
    question: poll.question,
    result: poll.result,
    votes: poll.votes,
  };

  if (poll.o3) {
    newPoll.options.push({
      count: poll.c3,
      id: 3,
      option: poll.o3,
    });
  }
  if (poll.o4) {
    newPoll.options.push({
      count: poll.c4,
      id: 4,
      option: poll.o4,
    });
  }
  if (poll.o5) {
    newPoll.options.push({
      count: poll.c5,
      id: 5,
      option: poll.o5,
    });
  }
  return newPoll;
};
