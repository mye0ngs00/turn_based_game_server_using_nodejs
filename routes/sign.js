const express = require('express');
const router = express.Router();

const sign_up = require('../controllers/sign-up');
const sign_in = require('../controllers/sign-in');

/* login form */
router.get('/in', (req, res)=>{
    if( !req.session.username ) res.render('sign_in');
    else res.redirect('/');
});

/* sign in */
router.post('/in', sign_in);

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

router.post('/up', sign_up);

module.exports = router;