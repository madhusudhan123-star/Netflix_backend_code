const axios = require('axios');
require('dotenv').config();

const genreMap = {
  action: 28,
  animation: 16,
  comedy: 35,
  crime: 80,
  drama: 18,
  experimental: 10770, // Example ID, please verify
  fantasy: 14, 
  historical: 36,
  horror: 27,
  romance: 10749,
  scienceFiction: 878,
  thriller: 53,
  western: 37,
  musical: 10402, // Example ID, please verify
  war: 10752
};

const TMDB_API_KEY = process.env.APIKey;
const TMDB_BASE_URL = process.env.Moviesurl;

const getMoviesByGenre = async (req, res) => {
  const { genre } = req.params;
  const genreId = genreMap[genre.toLowerCase()];

  if (!genreId) {
    return res.status(400).json({ message: 'Invalid genre' });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: `Error fetching movies for genre ${genre}`, error: error.message });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular movies', error: error.message });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.status(200).json(response.data.results.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top movies', error: error.message });
  }
};


const moviesController = {
  getPopularMovies,
  getTopMovies,
  getMoviesByGenre
};

module.exports = moviesController;