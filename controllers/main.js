module.exports = (req, res) => {
    // d u have an session?
    if (!req.session.username) res.redirect('/sign/in');
    else res.render('index');
}