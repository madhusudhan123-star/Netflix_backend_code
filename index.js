const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./router/auth');
const videos = require('./router/videos');
const profile = require('./router/profile');
const moviesRouter = require('./router/movies');
const tv_ShowRouter = require('./router/tv_show');
const search = require('./router/search');
const passport = require('passport');
require('dotenv').config();
app.use(express.json());
app.use(cors())
app.use(passport.initialize());

mongoose.connect(process.env.database, {})
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

    
app.use('/api',authRoutes)
app.use('/api', videos)
app.use('/api', profile)
app.use('/api/movies', moviesRouter)
app.use('/api/tvshow', tv_ShowRouter)
app.use('/api', search) // ?query=your-name

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT ||3001}`);
});




// router.post('/register', authController.signup);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);

// router.get('/userdetails', verifyTokenExpiration, profileDetails.userdetails);
// router.put('/userupdate', verifyTokenExpiration, profileDetails.userupdate);

// router.get('/profile/viewing-history', verifyTokenExpiration, profileDetails.getUserViewingHistory);
// router.get('/profile/watchlist', verifyTokenExpiration, profileDetails.getUserWatchlist);

// router.get('/:tvShowId/trailers',verifyTokenExpiration, tvShowsController.getTVShowTrailers);
// router.get('/:movieId/trailers', verifyTokenExpiration, moviesController.getMovieTrailers);
// router.post('/search', verifyTokenExpiration, search_controller.search);

// router.get('/popular', verifyTokenExpiration, moviesController.getPopularMovies);
// router.get('/top', verifyTokenExpiration, moviesController.getTopMovies);
// router.get('/:genre', verifyTokenExpiration, moviesController.getMoviesByGenre); // Dynamically handle genres

// router.get('/popular',verifyTokenExpiration, tvShowsController.getPopularTVShows);
// router.get('/top',verifyTokenExpiration, tvShowsController.getTopTVShows);
// router.get('/genre/:genre',verifyTokenExpiration, tvShowsController.getTVShowsByGenre);







