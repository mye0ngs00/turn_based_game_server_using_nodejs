const express = require('express');
const router = express.Router();
const gameAdapter = require('./game-adapter');

router.get('/', (req, res)=>{
    if( !req.session.username ) res.redirect('/sign/in');
    else{
        // debug mode.
        res.render('lobby',{
            ip: res.locals.ip,
            name: "GAME_MASTER",
            character: "test character1",
            turn: 0,
        });

        // 이거 중복정의라 팩토링 잘못됨. 나중에 리엔지니어링 필요.
        req.app.io.on('connection', (socket)=>{
            socket.on('enqueue', ( username )=>{
                gameAdapter( socket );
                socket.broadcast.emit('adduser', username );
            });
        });
    }
});

module.exports = router;