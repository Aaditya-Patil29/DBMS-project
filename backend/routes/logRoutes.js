const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/logController');

router.route('/').get(getLogs).post(createLog);

module.exports = router;
