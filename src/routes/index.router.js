const express = require('express');

const controller = require('../controllers/index.controller');

const router = express.Router();

router.route('/').get(controller.getIndex);

module.exports = router;
