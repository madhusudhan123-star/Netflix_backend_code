const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = 'c10406808a6f8e1c0dfd8028a56f1ab6';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


const search = async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
            api_key: TMDB_API_KEY,
            query: query,
        },
    });
    res.status(200).json(response.data.results);
    } catch (error) {
    res.status(500).json({ message: 'Error searching for movies/TV shows', error: error.message });
    }
}
const getTrailers = async (req, res) => {
    const { mediaType, id } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/${mediaType}/${id}/videos`, {
            params: {
                api_key: TMDB_API_KEY,
            },
        });
        const trailers = response.data.results.filter(video => video.type === 'Trailer');
        if (trailers.length === 0) {
            return res.status(404).json({ message: 'No trailers found' });
        }
        res.status(200).json(trailers);
    } catch (error) {
        console.error(`Error fetching trailers for ${mediaType} ID ${id}:`, error);
        res.status(500).json({ message: `Error fetching trailers for ${mediaType} ID ${id}`, error: error.message });
    }
};


const search_controller = {
    search,
    getTrailers
}


module.exports = search_controller;