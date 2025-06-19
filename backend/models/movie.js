const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true
  },
  title: String,
  overview: String,
  posterPath: String,
  releaseDate: String,
  genreIds: [Number],
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);

