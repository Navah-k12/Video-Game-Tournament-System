const express = require('express');
const router = express.Router();
const { registerScore, getRanking, getStats } = require('../controllers/scoreController');

router.post('/score', registerScore);
router.get('/ranking', getRanking);
router.get('/stats', getStats);

module.exports = router;