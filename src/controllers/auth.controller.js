const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const emailLoginCode = require('../emails/code.email');
const User = require('../models/User.model');
const { isValidEmail } = require('../util/validation');

function createCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Send a user a login code
exports.generateCode = async (req, res) => {
  const {
    email,
    optIn,
  } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(500).send({ error: 'Missing or invalid email' });
  }

  let user = await User.findOne({ where: { email } });
  const code = createCode(6);
  const codeTime = moment.now();

  if (user) {
    // User already has an account
    user.code = code;
    user.codeTime = codeTime;
    await user.save();
  } else {
    user = await User.create({
      code,
      codeTime,
      email,
      id: crypto.randomUUID(),
      power: Math.floor(Math.random() * 100),
      newsletter: optIn,
    });
  }
  emailLoginCode(email, code);
  // Email user the code here
  console.log(code);
  return res.status(200).send({ message: "Email sent" });
};

exports.validateCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ where: { email } });
  // 600000 is 10 minutes
  if (user) {
    if (user.code === code && moment.now() - user.codeTime < 600000) {
      const token = jwt.sign(
        {
          id: user.id, email: user.email, power: user.power, admin: user.admin,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '1d',
        },
      );
      user.code = null;
      user.codeTime = null;
      user.save();
      return res.status(200).send({ token });
    }
    return res.status(400).send({ error: 'Invalid code' });
  }
  return res.status(401).send({ error: 'User does not exist' });
};
