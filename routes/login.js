const express = require('express');
const router = express.Router();

/* app.use('/login', loginRouter) */

// login form
router.get('/', (req, res)=>{
    let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    console.log('ip: %s', ip);
    if( !req.session.username ) res.render('login', { ip });
    else res.redirect('/');
});

// login process
router.post('/', (req, res)=>{
    let id = req.body.id;
    let pw = req.body.password;

    /* 봉쇄 
    let query = 'SELECT * FROM user WHERE id=?';
    // finding id.
    req.app.conn.query(query, [id], (err, results)=>{
        if( err ) console.log(err);
        if( !results[0] ) return res.render('login', { msg: 'plz chk ur pw.'});
    });
    */

    // username = db_user.name 으로 변경 예정.
    if( id === "admin" && pw === "admin" ){
        req.session.username = "admin";
        req.session.save(()=>{
            res.redirect('/');
        });
    } 
    // dont find password.
    else res.render('login', { msg: 'plz chk ur pw.'});
    
    // when login be successed => render index.
    // when login dont be successed => render current page.
});

// logout
router.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        // logout exception
        if(err) console.error(err);
        res.redirect('/'); // just '/'
    });
});

module.exports = router;