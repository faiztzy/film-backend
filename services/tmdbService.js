const axios = require("axios");

const genreMap = require("../utils/genreMap");

const getMovieDetail = async (movieId) => {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: tmdbApiKey,
        },
      },
    );

    const movie = response.data;

    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,

      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      backdrop_url: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,

      release_date: movie.release_date,
      runtime: movie.runtime,
      vote_average: movie.vote_average,

      genres: movie.genres.map((genre) => genre.name),
    };
  } catch (error) {
    console.error("TMDB Error:", error.message);
    return null;
  }
};

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
    },
  );

  if (response.data.results && response.data.results.length > 0) {
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
      },
    );

    return response.data;
  } catch (error) {
    console.error("TMDB Error:", error.message);
    return null;
  }
};

const getPopularMovies = async () => {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;

    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        params: {
          api_key: tmdbApiKey,
          page: 1,
        },
      },
    );

    return response.data.results.slice(0, 10).map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,

      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      backdrop_url: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,

      release_date: movie.release_date,
      vote_average: movie.vote_average,

      genres: movie.genre_ids.map((id) => genreMap[id] || "Unknown"),
    }));
  } catch (error) {
    console.error("TMDB Error:", error.message);
    return [];
  }
};

module.exports = {
  searchMovieByTitle,
  getMovieById,
  getPopularMovies,
  getMovieDetail,
};
