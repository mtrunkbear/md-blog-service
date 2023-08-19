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
      const googleUser = {
        id: profile.id,
        email: profile.emails[0].value,
        avatarUrl: profile._json.picture,
        lastName: profile._json.family_name,
        firstName: profile._json.given_name,
      };
      const { email, id, avatarUrl, lastName, firstName } = googleUser;
      let user;
      user = await User.fetchById({ id });
      try {
        if (!user) {
          const newUser = new User({
            nickName: email.slice(0, 6) + v4().slice(0, 5),
            email,
            id,
            avatarUrl,
            lastName,
            firstName,
          });
          user = await newUser.save();
        }
        jwt.sign({ user }, secretKey, { expiresIn: "1h" }, (err, token) => {
          done(null, token);
        });
      } catch (err) {
        console.error("Error in google login  " + err);
        (req, res) => {
          res.redirect(`${process.env.APP_URL}`);
        };
      }
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
    res.redirect(`${process.env.APP_URL}/?token=${req.user}`);
  }
);

module.exports = router;
