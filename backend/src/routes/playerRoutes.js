const express = require('express');
const router = express.Router();
const { registerPlayers, getPlayers, searchPlayers } = require('../controllers/playerController');

router.post('/', registerPlayers);
router.get('/buscar', searchPlayers);
router.get('/', getPlayers);

module.exports = router;