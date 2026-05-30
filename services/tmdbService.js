const axios = require("axios");

const searchMovieByTitle = async (title) => {
  const tmdbApiKey = process.env.TMDB_API_KEY;

  const response = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        api_key: tmdbApiKey,
        query: title,
        page: 1,
      },
    }
  );

  if (
    response.data.results &&
    response.data.results.length > 0
  ) {
    return response.data.results[0];
  }

  return null;
};

const getMovieById = async (movieId) => {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: tmdbApiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("TMDB Error:", error.message);
    return null;
  }
};

module.exports = {
  searchMovieByTitle,
  getMovieById,
};