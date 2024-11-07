require("dotenv").config();

const AppConfig = {
  APP: { PORT: Number(process.env.PORT) },
  JWT: { SECRET_KEY: process.env.JWT_SECRET_KEY },
  QUERY: { TOP: 10, SKIP: 0, ORDER_BY: "desc" },
  REDIS: {
    URL: process.env.REDIS_URL || "redis://localhost:6379",
    CACHE_EXPIRATION: parseInt(
      process.env.CACHE_EXPIRATION_SECONDS || "3600",
      10
    ),
  },
};

export default AppConfig;
