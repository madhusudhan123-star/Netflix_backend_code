const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
    
router.post('/register', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:id', authController.resetPassword);

module.exports = router;    
