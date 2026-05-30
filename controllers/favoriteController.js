const supabase = require("../config/supabase");
const { getMovieById } = require("../services/tmdbService");

exports.addFavorite = async (req, res) => {
  try {
    console.log("=== ADD FAVORITE ===");
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);

    const { movie_id } = req.body;
    const user_id = req.user.id;

    console.log("USER ID:", user_id);
    console.log("MOVIE ID:", movie_id);

    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id,
          movie_id,
        },
      ])
      .select();

    console.log("SUPABASE DATA:", data);
    console.log("SUPABASE ERROR:", error);

    if (error) throw error;

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("ADD FAVORITE ERROR:", error);

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

    console.log("FAVORITES:", data);

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
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genres: movie.genres.map((genre) => genre.name),
          created_at: favorite.created_at,
        };
      }),
    );

    res.status(200).json({
      status: "success",
      movies: movies.filter(Boolean),
    });
  } catch (error) {
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
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
