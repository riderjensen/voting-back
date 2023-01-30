const express = require('express');

const controller = require('../controllers/newsletter.controller');

const router = express.Router();

router.route('/optin').post(controller.optIn);
router.route('/optout').post(controller.optOut);

module.exports = router;
