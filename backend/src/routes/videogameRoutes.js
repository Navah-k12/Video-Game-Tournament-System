const express = require('express');
const router = express.Router();
const { registerVideogame, getVideogames } = require('../controllers/videogameController');

router.post('/', registerVideogame);
router.get('/', getVideogames);

module.exports = router;