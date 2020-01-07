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
            let user = result[0];
            crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', (err2, keyStream)=>{
                // success.
                if( keyStream.toString('hex') === user.password ){
                    console.log("[SIGN IN] %s", user.id );
                    req.session.username = user.id;
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
    if( !req.session.username ) res.render('sign_up');
    else res.send('잘못된 요청입니다.');
});

router.post('/up', (req, res)=>{
    let id = req.body.id;
    let pw = req.body.password;
    // exception just web.
    if( !id || !pw ) res.render('sign_up', {msg: "정보를 확인해주세요."});
    else{
        let query = 'SELECT * FROM users WHERE id=?';
        req.app.conn.query(query, [id], (err, result)=>{
            if(err) console.error(err);
            // validate.
            if(!result[0]){
                let salt = crypto.randomBytes(16).toString('hex');
                query = 'INSERT INTO users (id, password, salt) VALUES (?, ?, ?)';
                // success.
                crypto.pbkdf2(pw, salt, 100000, 64, 'sha512', (err2, keyStream)=>{
                    if( err2 ) console.error(err2);
                    req.app.conn.query(query, [id, keyStream.toString('hex'), salt], (err3, result)=>{
                        if(err3) console.error(err3); //throw err;
                        else res.redirect('/sign/in');
                    });
                });
            }
            // failure.
            else res.render('sign_up', {msg: "이미 존재하는 아이디 입니다."});
        });
    }
});

module.exports = router;