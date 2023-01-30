const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const User = require('../models/User.model');
const { isValidEmail } = require('../util/validation');

async function createCode() {
  try {
    const code = await crypto.randomBytes(6);
    return code.toString('hex').slice(0, 6);
  } catch (err) {
    console.log('create code error');
    throw new Error('create code error');
  }
}

// Send a user a login code
exports.generateCode = async (req, res) => {
  const {
    email,
    admin,
    optIn,
  } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(500).json({ error: 'Missing or invalid email' });
  }

  let user = await User.findOne({ where: { email } });
  const code = await createCode();
  const codeTime = moment.now();

  if (user) {
    // User already has an account
    user.code = code;
    user.codeTime = codeTime;
    await user.save();
  } else {
    user = await User.create({
      admin,
      code,
      codeTime,
      email,
      id: crypto.randomUUID(),
      power: Math.floor(Math.random() * 100),
      newsletter: optIn,
    });
  }
  // Email user the code here
  console.log(code);
  return res.status(200).send('Email sent');
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
      return res.status(200).json({ token });
    }
    return res.status(400).json({ error: 'Invalid code' });
  }
  return res.status(401).json({ error: 'User does not exist' });
};
