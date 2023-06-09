const express = require("express");
const passport = require("passport");

const jwt = require("jsonwebtoken");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { googleOAuth: googleOAuthConfig } = require("../config");
const { v4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const secretKey = process.env.SECRET_KEY;

const router = express.Router();

passport.use(
  new GoogleStrategy(
    googleOAuthConfig,
    async (accessToken, refreshToken, profile, done) => {
      // Aquí puedes hacer cualquier cosa con el perfil de Google
      // Por ejemplo, podrías buscar el usuario en tu base de datos
      // y crear un JWT para él

      const googleUser = {
        id: profile.id,
        email: profile.emails[0].value,
      };
      const { email, id } = googleUser;

      const user = await User.fetchById({id});
      if (!user) {
        const newUser = new User({
          nickname: email.slice(0, 6) + v4().slice(0, 5),
          email,
          id,
        });
        await newUser.save();
      }

      jwt.sign({ user }, secretKey, { expiresIn: "1h" }, (err, token) => {
        done(null, token);
      });
    }
  )
);

router.use(passport.initialize());

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback de Google
router.get(
  "/google/callback/",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect(`http://localhost:5173/?token=${req.user}`);
  }
);

module.exports = router;
