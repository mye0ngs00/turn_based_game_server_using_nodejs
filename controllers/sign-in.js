const crypto = require('crypto');

module.exports = (req, res)=>{
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
}