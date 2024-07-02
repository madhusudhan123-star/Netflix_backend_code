const express = require('express');
const authController = require('../controllers/auth');
const passport = require('passport');
const router = express.Router();
    
router.post('/register', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);


// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect('/error/handle');
//   });


module.exports = router;
// router.get('/google-signup',authController.googleSignup);

// router.get('/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//       // Successful authentication, redirect home or to a specific page
//         res.redirect('/home');
//     }
// );
