const express = require('express');

const controller = require('../controllers/polls.controller');

const router = express.Router();

router.route('/').get(controller.getAllPolls);

module.exports = router;
