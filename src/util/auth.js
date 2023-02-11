const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

exports.token = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send({ error: 'Unauthorized' });

  return jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send({ error: 'Unauthorized' });

    req.id = user.id;
    req.email = user.email;

    return next();
  });
};

exports.admin = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.id,
    },
  });
  if (user?.admin) {
    return next();
  }
  return res.status(403).send({ error: 'Unauthorized' });
};

exports.optional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return next();

  return jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return next();

    req.id = user.id;
    req.email = user.email;

    return next();
  });
};
