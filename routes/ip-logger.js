exports = module.exports = ()=>{
    return (req, res, next)=>{
        res.locals.ip = req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        (req.connection.socket ? req.connection.socket.remoteAddress : null);

        console.log("Request IP: %s", res.locals.ip);
        next();
    }
}