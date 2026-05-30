const express = require("express");
const router = express.Router();

const {
  addFavorite,
  getFavorites,
  deleteFavorite,
  checkFavorite,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "favorite route works",
  });
});

router.post("/", protect, addFavorite);

router.get("/", protect, getFavorites);

router.get("/check/:movieId", protect, checkFavorite);

router.delete("/:movieId", protect, deleteFavorite);

module.exports = router;
