const express = require("express");
const router = express.Router();

const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "favorite route works",
  });
});

// DEBUG BODY REQUEST
router.post("/debug", (req, res) => {
  console.log("BODY:", req.body);

  res.json({
    status: "success",
    body: req.body,
  });
});

router.post("/", protect, addFavorite);
router.get("/", protect, getFavorites);
router.delete("/:movieId", protect, deleteFavorite);

module.exports = router;