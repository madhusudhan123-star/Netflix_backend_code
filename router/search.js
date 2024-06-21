const express = require('express');
const router = express.Router();
const verifyTokenExpiration = require('../middleware/auth');
const search_controller = require('../controllers/search');


router.post('/search', verifyTokenExpiration, search_controller.search);
router.get('/:mediaType/:id/trailers', verifyTokenExpiration, search_controller.getTrailers);



module.exports = router;