const express = require('express');
const router = express.Router();
const { registerScore, getRanking } = require('../controllers/scoreController');

router.post('/score', registerScore);
router.get('/ranking', getRanking);

module.exports = router;