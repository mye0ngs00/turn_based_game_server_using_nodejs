const express = require('express');
const router = express.Router();
const gameQueue = new (require('../data_structures/queue'));

router.get('/', (req, res)=>{
    // 소켓들 연결
    // 소켓 배분
    gameQueue.enqueue(2);
    res.render('lobby');
});

module.exports = router;