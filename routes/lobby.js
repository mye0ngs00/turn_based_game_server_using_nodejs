const express = require('express');
const router = express.Router();

const lobby = require('../controllers/lobby');

router.get('/', lobby);

module.exports = router;