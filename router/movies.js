const express = require('express');
const moviesController = require('../controllers/moviesController');
const verifyTokenExpiration = require('../middleware/auth');
const router = express.Router();

router.get('/popular', verifyTokenExpiration, moviesController.getPopularMovies);
router.get('/top', verifyTokenExpiration, moviesController.getTopMovies);
router.get('/:genre', verifyTokenExpiration, moviesController.getMoviesByGenre); // Dynamically handle genres

module.exports = router;