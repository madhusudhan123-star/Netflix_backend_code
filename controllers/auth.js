const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/auth');
require('dotenv').config();

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
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};  




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({status:"error", message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status:"error", message: 'Invalid username or password' });
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


const authController={
  signup,
  login,
  logout
}

module.exports = authController;