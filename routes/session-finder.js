exports = module.exports = ()=>{
    return (req, res, next)=>{
        if( !req.session.username ) res.render('sign_in', { msg: "경로가 잘못됐습니다."});
        else next();
    }
}