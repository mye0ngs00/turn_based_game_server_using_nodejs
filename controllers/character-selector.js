module.exports = (req, res)=>{
  if( req.session.username && req.body.name){
    req.session.user = {};
    req.session.user.alias = req.body.name;
    req.session.user.character = req.body.character;

    req.session.save((err)=>{
      res.render('lobby',{
        ip: res.locals.ip,
        name: req.session.user.alias,
        character: req.session.user.character,
      });
    });
  }else{
    res.redirect('/');
  }
}