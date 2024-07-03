const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/auth');
const nodemailer = require('nodemailer');
const url = require('url');
require('dotenv').config();

// Create a single nodemailer transporter to be used across functions
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const signup = async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedPassword});
    await newUser.save();

    // Send welcome email
    await sendEmail(
      email,
      'Welcome to Our Website!',
      `Dear ${name},\n\nWelcome to our website! We're thrilled to have you join our community...`,
      `<h1>Welcome to Our Website!</h1><p>Dear ${name},</p>...`
    );

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Signup error:', error);
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


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
    
    await sendEmail(
      user.email,
      'Password Reset Request',
      `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    );

    res.status(200).json({ status: "success", message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: "error", message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const token  = req.params.id;
  const { newPassword } = req.body;
  console.log(token, newPassword);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ status: "error", message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ status: "success", message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: "error", message: 'Internal server error' });
  }
};

const authController = {
  signup,
  login,
  logout,
  resetPassword,
  forgotPassword
};

module.exports = authController;