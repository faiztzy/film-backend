const axios = require("axios");

exports.getRecommendations = async (req, res) => {
  try {
    const { synopsis } = req.body;

    // Validasi input
    if (!synopsis || synopsis.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Sinopsis film wajib diisi.",
      });
    }

    // Mengambil URL FastAPI dari .env atau fallback ke localhost port 8000
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    
    // Kirim request ke FastAPI
    const aiResponse = await axios.post(`${aiServiceUrl}/recommend`, {
      synopsis: synopsis,
    });

    // Cek respon dari FastAPI berdasarkan hasil pengujian sebelumnya
    if (aiResponse.data && aiResponse.data.status === "success") {
      const aiMovies = aiResponse.data.recommendations;
      const tmdbApiKey = process.env.TMDB_API_KEY;

      // --- MULAI BLOK INTEGRASI TMDB API ---
      const enrichedMovies = await Promise.all(
        aiMovies.map(async (movie) => {
          try {
            // Request ke TMDB Search API berdasarkan judul film
            const tmdbRes = await axios.get("https://api.themoviedb.org/3/search/movie", {
              params: {
                api_key: tmdbApiKey,
                query: movie.title,
                page: 1
              }
            });

            let posterUrl = null;
            let releaseYear = null;

            // Jika ditemukan hasil di TMDB, ambil data urutan pertama (index 0)
            if (tmdbRes.data.results && tmdbRes.data.results.length > 0) {
              const tmdbData = tmdbRes.data.results[0];
              
              if (tmdbData.poster_path) {
                posterUrl = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
              }
              if (tmdbData.release_date) {
                releaseYear = tmdbData.release_date.split('-')[0];
              }
            }

            // Gabungkan data film asli (skor AI) dengan data visual dari TMDB
            return {
              ...movie,
              poster_url: posterUrl,
              release_year: releaseYear
            };

          } catch (tmdbError) {
            console.error(`Gagal memuat TMDB untuk film: ${movie.title}`, tmdbError.message);
            // Fallback: Jika koneksi ke TMDB gagal untuk 1 film, kembalikan data null agar aplikasi tidak crash
            return {
              ...movie,
              poster_url: null,
              release_year: null
            };
          }
        })
      );
      // --- AKHIR BLOK INTEGRASI TMDB API ---

      return res.status(200).json({
        success: true,
        message: "Rekomendasi film dan visual berhasil didapatkan.",
        synopsis_received: aiResponse.data.synopsis_received,
        data: enrichedMovies, // Data dikirim menggunakan array yang sudah diperkaya TMDB
      });
    } else {
      throw new Error("Format respon dari AI Service tidak sesuai.");
    }

  } catch (error) {
    console.error("Error pada Recommendation Controller:", error.message);
    
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "Layanan pemrosesan AI (FastAPI) sedang tidak aktif.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server saat memproses rekomendasi.",
    });
  }
};