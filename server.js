const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});