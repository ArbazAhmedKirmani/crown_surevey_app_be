require("dotenv").config();

const AppConfig = {
  APP: { PORT: Number(process.env.PORT) },
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET_KEY || "superduper_property_survey_app",
    TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRATION,
  },
  QUERY: { TOP: 10, SKIP: 0, ORDER_BY: "desc" },
  REDIS: {
    URL: process.env.REDIS_URL || "redis://localhost:6379",
    CACHE_EXPIRATION: parseInt(
      process.env.CACHE_EXPIRATION_SECONDS || "3600",
      10
    ),
  },
  DOC_IMAGE: { HEIGTH: 250, WIDTH: 250 },
};

Object.seal(AppConfig);
export default AppConfig;
