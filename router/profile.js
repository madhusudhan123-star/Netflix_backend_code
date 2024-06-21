const express = require('express');
const router = express.Router();
const profileDetails  = require('../controllers/profile');
const verifyTokenExpiration = require('../middleware/auth');



router.get('/userdetail', verifyTokenExpiration, profileDetails.userdetails);

router.put('/userdetail', verifyTokenExpiration, profileDetails.userupdate);

router.get('/profile/viewing-history', verifyTokenExpiration, profileDetails.getUserViewingHistory);

router.get('/profile/watchlist', verifyTokenExpiration, profileDetails.getUserWatchlist);


module.exports=router;