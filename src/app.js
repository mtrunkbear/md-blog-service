const express = require("express");
const jwt = require("jsonwebtoken");
const routes = require("./routes");
const authRoutes = require("./routes/auth");

const dotenv = require("dotenv");
dotenv.config();


const cors = require("cors"); // importa cors

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Ruta protegida para obtener los datos del usuario
app.get("/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Token no proporcionado" });
      return;
    }

  // Verificamos el token JWT y obtenemos los datos del usuario
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { user } = decodedToken;
    res.json(user);
  } catch (error) {
    console.error({ error });
    res.status(401, { error: "Token inválido" });
  }
});

app.use("/auth", authRoutes);
app.use("/api", routes);

module.exports = app;
