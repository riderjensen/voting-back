const express = require('express');

const controller = require('../controllers/user.controller');

const router = express.Router();

router.route('/').get(controller.getUser);
router.route('/votes').get(controller.getUserVotes);

module.exports = router;
