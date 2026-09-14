const express = require('express');
const router = express.Router();
const { registerScore } = require('../controllers/scoreController');

router.post('/score', registerScore);

module.exports = router;