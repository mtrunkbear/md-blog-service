const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  googleOAuth: {
    clientID:
      process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL +"/auth/google/callback/",
  },
};
