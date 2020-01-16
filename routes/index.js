const express = require('express');
const router = express.Router();

const character_selector = require('../controllers/character-selector');
const main = require('../controllers/main');

/* GET home page. */
router.get('/', main);

router.post('/', character_selector);

module.exports = router;
