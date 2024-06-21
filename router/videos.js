const express = require('express');
const videoscontent = require('../controllers/videos');
const verifyTokenExpiration = require('../middleware/auth');
const router = express.Router();


router.get('/',verifyTokenExpiration ,videoscontent.videos)


module.exports = router;