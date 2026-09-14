const express = require('express');
const router = express.Router();
const { registerPlayers, getPlayers, searchPlayers } = require('../controllers/playerController');

router.post('/register', registerPlayers);
router.get('/search', searchPlayers);
router.get('/', getPlayers);

module.exports = router;