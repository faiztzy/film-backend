const axios = require("axios");

const getMovieRecommendations = async (synopsis) => {
  const modelServiceUrl = process.env.MODEL_SERVICE_URL;

  const response = await axios.post(
    `${modelServiceUrl}/recommend`,
    {
      synopsis,
    }
  );

  return response.data;
};

module.exports = {
  getMovieRecommendations,
};