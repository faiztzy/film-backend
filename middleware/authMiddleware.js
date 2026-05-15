const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ada"
    });
  }

  try {

    token = token.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

  console.log(error);

  res.status(401).json({
    message: "Token tidak valid"
  });
}
};

module.exports = protect;