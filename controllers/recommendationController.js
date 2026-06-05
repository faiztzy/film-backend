const { franc } = require("franc");
const BadWords = require("bad-words");
const filter = new BadWords();

const genreMap = require("../utils/genreMap");

const {
  getMovieRecommendations,
} = require("../services/modelService");

const {
  searchMovieByTitle,
} = require("../services/tmdbService");

// Validation settings
const MIN_CHARS = 30;
const MIN_WORDS = 5;

// Detect gibberish text
function isGibberish(text) {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);

  const vowels = /[aeiou]/gi;
  const letters = /[a-z]/gi;

  let gibberishWordCount = 0;

  for (const word of words) {
    if (word.length < 3) continue;

    const letterCount = (word.match(letters) || []).length;
    const vowelCount = (word.match(vowels) || []).length;

    if (letterCount === 0) continue;

    const vowelRatio = vowelCount / letterCount;

    if (vowelRatio < 0.15 || vowelRatio > 0.85) {
      gibberishWordCount++;
    }
  }

  return gibberishWordCount / words.length > 0.5;
}

function hasRealWords(text) {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  if (words.length === 0) return false;

  const realPatterns =
    /[aeiou][bcdfghjklmnpqrstvwxyz]|[bcdfghjklmnpqrstvwxyz][aeiou]/gi;

  let realWordCount = 0;

  for (const word of words) {
    const matches = (word.match(realPatterns) || []).length;

    if (matches / word.length >= 0.3) {
      realWordCount++;
    }
  }

  return realWordCount / words.length >= 0.5;
}

function validateSynopsis(synopsis) {
  const trimmed = synopsis.trim();

  if (trimmed.length < MIN_CHARS) {
    return {
      valid: false,
      message: `Synopsis must be at least ${MIN_CHARS} characters.`,
    };
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount < MIN_WORDS) {
    return {
      valid: false,
      message: `Synopsis must contain at least ${MIN_WORDS} words.`,
    };
  }

  if (!hasRealWords(trimmed)) {
    return {
      valid: false,
      message:
        "Synopsis appears to be gibberish. Please write a meaningful movie synopsis.",
    };
  }

  if (isGibberish(trimmed)) {
    return {
      valid: false,
      message:
        "Synopsis appears to be gibberish. Please write a meaningful movie synopsis.",
    };
  }

  const detectedLang = franc(trimmed, {
    minLength: 20,
  });

  if (detectedLang === "und") {
    return {
      valid: false,
      message:
        "Synopsis is not recognizable as any language. Please write a meaningful synopsis.",
    };
  }

  try {
    if (filter.isProfane(trimmed)) {
      return {
        valid: false,
        message:
          "Synopsis contains inappropriate language. Please keep it clean.",
      };
    }
  } catch (error) {
    console.error(error.message);
  }

  return {
    valid: true,
  };
}

exports.getRecommendations = async (req, res) => {
  try {
    const { synopsis } = req.body;

    // Empty validation
    if (!synopsis || synopsis.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Synopsis is required",
      });
    }

    // Advanced validation
    const validation = validateSynopsis(synopsis);

    if (!validation.valid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    // Call ML Service
    const aiResponse = await getMovieRecommendations(
      synopsis,
    );

    if (
      !aiResponse ||
      aiResponse.status !== "success"
    ) {
      return res.status(500).json({
        status: "error",
        message: "Model service failed",
      });
    }

    const movies = await Promise.all(
      aiResponse.recommendations.map(
        async (movie) => {
          try {
            const tmdbMovie =
              await searchMovieByTitle(
                movie.title,
              );

            return {
              rank: movie.rank,
              similarity_score:
                movie.similarity_score,
              ml_title: movie.title,

              tmdb: tmdbMovie
                ? {
                    id: tmdbMovie.id,
                    title: tmdbMovie.title,
                    overview:
                      tmdbMovie.overview,

                    poster_path:
                      tmdbMovie.poster_path,

                    backdrop_path:
                      tmdbMovie.backdrop_path,

                    release_date:
                      tmdbMovie.release_date,

                    vote_average:
                      tmdbMovie.vote_average,

                    genres: tmdbMovie.genre_ids
                      ? tmdbMovie.genre_ids.map(
                          (id) =>
                            genreMap[id] ||
                            "Unknown",
                        )
                      : [],
                  }
                : null,
            };
          } catch (error) {
            console.error(
              `TMDB Error for ${movie.title}:`,
              error.message,
            );

            return {
              rank: movie.rank,
              similarity_score:
                movie.similarity_score,
              ml_title: movie.title,
              tmdb: null,
            };
          }
        },
      ),
    );

    const validMovies = movies.filter(
      (m) => m.tmdb !== null,
    );

    const maxScore =
      validMovies.length > 0
        ? Math.max(
            ...validMovies.map(
              (m) =>
                m.similarity_score || 0,
            ),
          )
        : 0;

    if (maxScore < 0.4) {
      return res.status(400).json({
        status: "error",
        message:
          "Your synopsis didn't match any movies meaningfully. Please write a more descriptive synopsis.",
      });
    }

    return res.status(200).json({
      status: "success",
      movies,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};