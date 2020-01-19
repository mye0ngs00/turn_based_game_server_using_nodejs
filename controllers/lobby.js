module.exports = (req, res)=>{
    if( !req.session.username ) res.redirect('/sign/in');
    else{
        if( req.session.user ){
            res.render('lobby',{
                ip: res.locals.ip,
                name: req.session.user.alias,
                character: req.session.user.character,
            });
        }
        else{
            // move to page (character selection).
            res.redirect('/');
        }
        // debug mode.
        
    }
}