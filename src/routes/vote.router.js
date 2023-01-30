const express = require('express');

const controller = require('../controllers/vote.controller');

const router = express.Router();

router.route('/votes').get(controller.getVotes);
router.route('/:pollId').post(controller.vote);

module.exports = router;
