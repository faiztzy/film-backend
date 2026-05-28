const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendationController");
const protect = require("../middleware/authMiddleware"); // Mengarah ke middleware milikmu

// Endpoint: POST /api/movies/recommend
router.post("/recommend", protect, getRecommendations);

module.exports = router;