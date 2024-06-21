const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.APIKey;
const TMDB_BASE_URL = process.env.Moviesurl;

const tvGenreMap = {
  action: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  documentary: 99,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  news: 10763,
  reality: 10764,
  scifi: 10765,
  soap: 10766,
  talk: 10767,
  war: 10768,
  western: 37
};

const getTVShowsByGenre = async (req, res) => {
  const { genre } = req.params;
  const genreId = tvGenreMap[genre.toLowerCase()];

  if (!genreId) {
    return res.status(400).json({ message: 'Invalid genre' });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: `Error fetching TV shows for genre ${genre}`, error: error.message });
  }
};

const getPopularTVShows = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular TV shows', error: error.message });
  }
};

const getTopTVShows = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.status(200).json(response.data.results.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top TV shows', error: error.message });
  }
};


tvShowsController = {
    getTVShowsByGenre,
    getPopularTVShows,
    getTopTVShows,
    
};

module.exports = tvShowsController;
