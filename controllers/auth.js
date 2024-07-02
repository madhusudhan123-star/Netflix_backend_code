const {OAuth2Client} = require('google-auth-library');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/auth');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const  signup = async (req, res) => {
    const {name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};  




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status:"error", message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY,  { expiresIn: '7d' });
    // const expirationTime = new Date(Date.now() + 36000); // 1 hour from now

    user.token = token;
    // user.expireAt = expirationTime;
    await user.save();
    res.cookie('token', token, { httpOnly: true, maxAge: 604800000 });
    res.status(200).json({ status:"success", message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({status:"error", message: 'Internal server error' });
  }
};

const logout = async (req, res) =>{
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ status:"success", message: 'Logout successful' });
}
  
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/home", 
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     console.log("Google Profile_three");
//     const existingUser = await User.findOne({ userId: profile.id });
//     if (existingUser) {
//       return done(null, existingUser);
//     }

//     const newUser = new User({
//       userId: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value
//     });
//     await newUser.save();
//     const token = jwt.sign({ userId: profile.id }, process.env.JWTPRIVATEKEY,  { expiresIn: '7d' });
//     // const expirationTime = new Date(Date.now() + 36000); // 1 hour from now

//     existingUser.token = token;
//     // user.expireAt = expirationTime;
//     await user.save();
//     res.cookie('token', token, { httpOnly: true, maxAge: 604800000 });
//     res.status(200).json({ status:"success", message: 'Login successful', token });
//     done(null, newUser);
//   } catch (error) {
//     done(error, null);
//   }
// }));


// const googleSignup = passport.authenticate('google', { scope: ['profile', 'email'] });


const authController={
  signup,
  login,
  logout,
  // googleSignup
}

module.exports = authController;
