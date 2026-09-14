const express = require('express');
const router = express.Router();
const { registerPlayers, getPlayers } = require('../controllers/playerController');

router.post('/register', registerPlayers);
router.get('/', getPlayers);

module.exports = router;