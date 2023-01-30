const express = require('express');

const controller = require('../controllers/polls.controller');

const router = express.Router();

router.route('/poll/create').post(controller.createPoll);
router.route('/open/:id').get(controller.openPoll);
router.route('/close/:id').get(controller.closePoll);

module.exports = router;
