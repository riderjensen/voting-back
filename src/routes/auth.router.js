const express = require('express');

const controller = require('../controllers/auth.controller');

const router = express.Router();

router.route('/gen').post(controller.generateCode);
router.route('/val').post(controller.validateCode);

module.exports = router;
