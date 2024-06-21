const mongoose = require('mongoose');

const viewingHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videos: [
    {
      videoId: { type: String, required: true },
      watchedAt: { type: Date, default: Date.now },
    },
  ],
});

const ViewingHistory = mongoose.model('ViewingHistory', viewingHistorySchema);

module.exports = ViewingHistory;
