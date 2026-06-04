const express = require("express");
const router = express.Router();

const {
  getPopularMovies,
  getMovieDetail,
  getMovieTrailer,
  searchMovies,
} = require("../controllers/movieController");

router.get("/popular", getPopularMovies);

router.get("/search", searchMovies);

router.get("/:movieId/trailer", getMovieTrailer);

router.get("/:movieId", getMovieDetail);

module.exports = router;