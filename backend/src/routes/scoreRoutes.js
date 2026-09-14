const express = require('express');
const router = express.Router();
const { registerScore, getScores, getRanking, getStats } = require('../controllers/scoreController');

router.post('/', registerScore);
router.get('/', getScores);
router.get('/ranking', getRanking);
router.get('/estadisticas', getStats);

module.exports = router;