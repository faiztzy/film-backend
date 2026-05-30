const express = require("express");
const cors = require("cors");
require("dotenv").config();



const app = express();

app.use(cors());
app.use(express.json());


// Import Routes
const authRoutes = require("./routes/authRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes"); // Import rute baru
const favoriteRoutes = require("./routes/favoriteRoutes");
const movieRoutes = require("./routes/movieRoutes");

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", recommendationRoutes); // Daftarkan rute dengan prefix /api/movies
app.use("/api/favorites", favoriteRoutes);
app.use("/api/movies", movieRoutes);



app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});