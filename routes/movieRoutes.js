const express = require("express");
const router = express.Router();

const {
  getPopularMovies,
  getMovieDetail,
} = require("../controllers/movieController");

router.get("/popular", getPopularMovies);

router.get("/:movieId", getMovieDetail);

module.exports = router;