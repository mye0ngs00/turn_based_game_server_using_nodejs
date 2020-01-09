const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    // 세션확인
    // 소켓들 연결
    // 소켓 배분
    //req.gameQueue.enqueue(2);
    res.render('lobby');
});

module.exports = router;