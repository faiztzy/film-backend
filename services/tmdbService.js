const axios = require("axios");

const genreMap = require("../utils/genreMap");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

const getMovieDetail = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

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

const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: 1,
      },
    });

    return response.data.results.map((movie) => ({
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
    }));
  } catch (error) {
    console.error("TMDB Search Error:", error.message);
    return [];
  }
};

const getMovieById = async (movieId) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("TMDB Error:", error.message);
    return null;
  }
};

const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page: 1,
      },
    });

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

const getMovieTrailer = async (movieId) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/videos`,
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      },
    );

    const trailer = response.data.results.find(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube",
    );

    return trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null;
  } catch (error) {
    console.error("TMDB Trailer Error:", error.message);
    return null;
  }
};

module.exports = {
  searchMovies,
  getMovieById,
  getPopularMovies,
  getMovieDetail,
  getMovieTrailer,
};