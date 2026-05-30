const supabase = require("../config/supabase");
const { getMovieById } = require("../services/tmdbService");

exports.addFavorite = async (req, res) => {
  try {
    const { movie_id } = req.body;
    const user_id = req.user.id;

    if (!movie_id) {
      return res.status(400).json({
        status: "error",
        message: "movie_id is required",
      });
    }

    // Cek apakah sudah ada di favorites
    const { data: existing } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user_id)
      .eq("movie_id", movie_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Movie already in favorites",
      });
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id,
          movie_id,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Favorite Error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    const movies = await Promise.all(
      data.map(async (favorite) => {
        const movie = await getMovieById(favorite.movie_id);

        if (!movie) return null;

        return {
          favorite_id: favorite.id,
          movie_id: movie.id,
          title: movie.title,
          overview: movie.overview,

          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,

          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,

          backdrop_url: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : null,

          release_date: movie.release_date,
          vote_average: movie.vote_average,

          genres: movie.genres
            ? movie.genres.map((genre) => genre.name)
            : [],

          created_at: favorite.created_at,
        };
      })
    );

    res.status(200).json({
      status: "success",
      movies: movies.filter(Boolean),
    });
  } catch (error) {
    console.error("Favorite Error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user_id = req.user.id;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("movie_id", movieId)
      .eq("user_id", user_id);

    if (error) throw error;

    res.status(200).json({
      status: "success",
      message: "Favorite removed",
    });
  } catch (error) {
    console.error("Favorite Error:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user_id)
      .eq("movie_id", movieId)
      .maybeSingle();

    if (error) throw error;

    res.status(200).json({
      isFavorite: !!data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};