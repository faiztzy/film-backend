const {
  getPopularMovies,
  getMovieDetail,
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