const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    if( !req.session.username ) res.redirect('/sign/in');
    else{
        // debug mode.
        res.render('lobby',{
            ip: res.locals.ip,
            name: req.session.username,
            character: "test character1",
            turn: 0,
        });
    }
});

module.exports = router;