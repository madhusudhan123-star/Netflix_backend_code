const express = require('express');
const tvShowsController = require('../controllers/tvShowsController');
const verifyTokenExpiration = require('../middleware/auth')
const router = express.Router();

router.get('/popular',verifyTokenExpiration, tvShowsController.getPopularTVShows);
router.get('/top',verifyTokenExpiration, tvShowsController.getTopTVShows);
router.get('/:genre',verifyTokenExpiration, tvShowsController.getTVShowsByGenre);

module.exports = router;
 