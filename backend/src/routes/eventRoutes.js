
const express = require('express');
const router = express.Router();
const {registerVideogame} = require('../controllers/eventsController');

router.post('/event', registerVideogame);

module.exports = router;