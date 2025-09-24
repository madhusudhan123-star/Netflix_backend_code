const ViewingHistory = require('../models/viewHisory');
const Watchlist = require('../models/watchlist');
const User = require("../models/auth");
const bcrypt = require('bcryptjs');


const userdetails = async (req, res) => {
    try {
      const userId = req.userId; // Assuming you have the user ID from the token
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Exclude the password from the response
      const { password, ...userDetails } = user._doc;
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
}

const userupdate = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have the user ID from the token
    const { name, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's details
    user.name = name || user.name;
    user.email = email || user.email;

    // Update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user document
    const updatedUser = await user.save();

    // Exclude the password from the response
    const { password: _, ...userDetails } = updatedUser._doc;

    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details', error: error.message });
  }
};

const getUserViewingHistory = async (req, res) => {
    try {
      const userId = req.userId;
      const viewingHistory = await ViewingHistory.findOne({ userId });
  
      if (!viewingHistory) {
        return res.status(200).json({ videos: [] });
      }
  
      res.status(200).json(viewingHistory);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching viewing history', error: error.message });
    }
};

const getUserWatchlist = async (req, res) => {
    try {
      const userId = req.userId;
      const watchlist = await Watchlist.findOne({ userId });
  
      if (!watchlist) {
        return res.status(200).json({ videos: [] });
      }
  
      res.status(200).json(watchlist);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
};

const profileDetails = {
    userdetails,
    userupdate,
    getUserWatchlist,
    getUserViewingHistory
}


module.exports = profileDetails;







