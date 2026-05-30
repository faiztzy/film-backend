const supabase = require("../config/supabase");

exports.addFavorite = async (req, res) => {
  try {
    const { movie_id } = req.body;
    const user_id = req.user.id;

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

    res.status(200).json({
      status: "success",
      data,
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