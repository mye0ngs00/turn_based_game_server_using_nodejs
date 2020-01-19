const express = require('express');
const router = express.Router();

let t = 1;
router.get('/', (req, res) => {

    if (req.session.username && req.session.user) {
        t = t === 1? 0:1;
        res.render('game', {
            ip: res.locals.ip,
            name: req.session.user.alias,
            character: req.session.user.character,
            turn: t,
        });  // room
    }
    else res.redirect('/');
});
module.exports = router;