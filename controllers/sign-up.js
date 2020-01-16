const crypto = require('crypto');

module.exports = (req, res)=>{
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
}