const genreMap = require("../utils/genreMap");

const {
  getMovieRecommendations,
} = require("../services/modelService");

const {
  searchMovieByTitle,
} = require("../services/tmdbService");

exports.getRecommendations = async (req, res) => {
  try {
    const { synopsis } = req.body;

    if (!synopsis || synopsis.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Synopsis is required",
      });
    }

    // HIT MODEL SERVICE
    const aiResponse = await getMovieRecommendations(
      synopsis
    );

    if (
      !aiResponse ||
      aiResponse.status !== "success"
    ) {
      return res.status(500).json({
        status: "error",
        message: "Model service failed",
      });
    }

    // LOOP RECOMMENDATIONS
    const movies = await Promise.all(
      aiResponse.recommendations.map(
        async (movie) => {
          try {
            const tmdbMovie =
              await searchMovieByTitle(
                movie.title
              );

            return {
              rank: movie.rank,
              similarity_score:
                movie.similarity_score,
              ml_title: movie.title,

              tmdb: tmdbMovie
                ? {
                    id: tmdbMovie.id,
                    title: tmdbMovie.title,
                    overview:
                      tmdbMovie.overview,
                    poster_path:
                      tmdbMovie.poster_path,
                    backdrop_path:
                      tmdbMovie.backdrop_path,
                    release_date:
                      tmdbMovie.release_date,
                    vote_average:
                      tmdbMovie.vote_average,

                    genres:
                      tmdbMovie.genre_ids.map(
                        (id) =>
                          genreMap[id] ||
                          "Unknown"
                      ),
                  }
                : null,
            };
          } catch (error) {
            console.error(
              `TMDB Error for ${movie.title}:`,
              error.message
            );

            return {
              rank: movie.rank,
              similarity_score:
                movie.similarity_score,
              ml_title: movie.title,
              tmdb: null,
            };
          }
        }
      )
    );

    return res.status(200).json({
      status: "success",
      movies,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};