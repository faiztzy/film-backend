const express = require("express");
const router = express.Router();

const {
  getPopularMovies,
  getMovieDetail,
  getMovieTrailer,
} = require("../controllers/movieController");

// Popular Movies
router.get("/popular", getPopularMovies);

// Movie Trailer
router.get("/:movieId/trailer", getMovieTrailer);

// Movie Detail
router.get("/:movieId", getMovieDetail);

module.exports = router;