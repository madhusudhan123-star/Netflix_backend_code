const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videos: [
    {
      videoId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
