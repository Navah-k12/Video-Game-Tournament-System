const express = require('express');
const router = express.Router();
const { registerVideogame, getVideogames } = require('../controllers/videogameController');

router.post('/register', registerVideogame);
router.get('/', getVideogames);

module.exports = router;