
const express = require('express');
const router = express.Router();
const {registerScores} = require('../controllers/scoreController');

router.post('/score', registerScores);

module.exports = router;