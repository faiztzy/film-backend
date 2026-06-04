const {
  getPopularMovies,
  getMovieDetail,
  getMovieTrailer: getMovieTrailerService,
  searchMovies: searchMoviesService,
} = require("../services/tmdbService");

// GET /api/movies/popular
exports.getPopularMovies = async (req, res) => {
  try {
    const movies = await getPopularMovies();

    res.status(200).json({
      status: "success",
      total: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /api/movies/search?query=batman
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Query parameter is required",
      });
    }

    const movies = await searchMoviesService(query);

    res.status(200).json({
      status: "success",
      total: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /api/movies/:movieId
exports.getMovieDetail = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await getMovieDetail(movieId);

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
      });
    }

    res.status(200).json({
      status: "success",
      movie,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /api/movies/:movieId/trailer
exports.getMovieTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;

    const trailerUrl = await getMovieTrailerService(movieId);

    if (!trailerUrl) {
      return res.status(404).json({
        status: "error",
        message: "Trailer not found",
      });
    }

    res.status(200).json({
      status: "success",
      movie_id: Number(movieId),
      trailer_url: trailerUrl,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};