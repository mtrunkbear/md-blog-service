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
      "1130884802-l7qluhshcckfjpie85ehlbp0aj61qchj.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: process.env.API_URL +"/auth/google/callback/",
  },
};
