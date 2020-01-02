const express = require('express');
const router = express.Router();

/* app.use('/login', loginRouter) */

// login
router.post('/', (req, res)=>{
    let id = req.body.username;
    let pw = req.body.password;



});

// logout
router.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        // logout exception
        if(err);
        res.redirect('/'); // just '/'
    });
});

module.exports = router;