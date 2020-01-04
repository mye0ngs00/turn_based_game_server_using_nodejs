const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // for sign.

/* login form */
router.get('/in', (req, res)=>{
    let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    console.log('ip: %s', ip);
    if( !req.session.username ) res.render('sign_in');
    else res.redirect('/');
});

/* sign in */
router.post('/in', (req, res)=>{
    let id = req.body.id;
    let pw = req.body.password;

    let query = 'SELECT * FROM users WHERE id=?';
    // finding id.
    req.app.conn.query(query, [id], (err, result)=>{
        if( err ) console.log(err);

        // id failure.
        if( !result[0] ) res.render('sign_in', { msg: 'plz chk ur pw.'});
        else{
            crypto.pbkdf2(pw, "user.salt", 100000, 64, 'sha512', (err2, keyStream)=>{
                // success.
                if( keyStream.toString('hex') === result[0].password ){
                    console.log("[SIGN IN] %s", result[0].id );
                    req.session.username = result[0].id;
                    req.session.save((err)=>{
                        if(err) console.error(err);
                        res.redirect('/');
                    });
                }
                // pw failure.
                else res.render('sign_in', { msg: 'plz chk ur pw.'});
            });
        } 
    });
});

/* sign out */
router.get('/out', (req, res)=>{
    req.session.destroy((err)=>{
        // logout exception
        if(err) console.error(err);
        res.redirect('/');
    });
});

/* sign up */
router.get('/up', (req, res)=>{
    res.render('sign_up');
});

router.post('/up', (req, res)=>{
    let id = req.body.id;
    let pw = req.body.password;

    let query = 'SELECT * FROM users WHERE id=?';
    req.app.conn.query(query, [id], (err, result)=>{
        if(err) console.error(err);
        // validate.
        if(!result[0]){
            query = 'INSERT INTO users (id, password) VALUES (?, ?)';
            // success.
            crypto.pbkdf2(pw, "user.salt", 100000, 64, 'sha512', (err2, keyStream)=>{
                if( err2 ) console.error(err2);
                req.app.conn.query(query, [id, keyStream.toString('hex')], (err3, result)=>{
                    if(err3) console.error(err3); //throw err;
                    else res.redirect('/sign/in');
                });
            });
        }
        // failure.
        else res.render('sign_up', {msg: "이미 존재하는 아이디 입니다."});
    });
});

module.exports = router;