

const express = require('express');
const router = express.Router();
const { registerPlayers } = require('../controllers/playerController');

router.post('/register', registerPlayers);

module.exports = router;
