
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

// Middleware to validate jwt
const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token doesn't provided" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken.user; // Guardar los datos del usuario en el objeto req
    next();
  } catch (error) {
    console.error("Error in JWT validation: "+ error );
    return res.status(401).json({ error: "Invalid Token" });
  }
};
module.exports = validateJWT;
