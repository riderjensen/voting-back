const { randomUUID } = require('crypto');
const User = require('../models/User.model');
const { isValidEmail } = require('../util/validation');

exports.optIn = async (req, res) => {
  const { email } = req.body;

  if (!email && isValidEmail(email)) return res.status(500).send({ error: 'Missing email' });

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    user.newsletter = true;
    await user.save();
    return res.status(200).send({ message: "User was opted into the newsletter" });
  }

  await User.create({
    id: randomUUID(),
    email,
    newsletter: true,
  });

  return res.status(201).send({ message: "User was created and opted into the newsletter" });
};

exports.optOut = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    user.newsletter = false;
    await user.save();
  }

  return res.status(200).send({ message: `If the email ${email} is in our database, it will be removed from our newsletter.` });
};
