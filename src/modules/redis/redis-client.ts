import { createClient, RedisClientType } from "redis";
import AppConfig from "../../utils/config/app.config";

class RedisClient {
  private static instance: RedisClientType;

  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: AppConfig.REDIS.URL,
      });

      RedisClient.instance.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      RedisClient.instance.connect().then(() => {
        console.log("Connected to Redis");
      });
    }

    return RedisClient.instance;
  }
}

export default RedisClient.getInstance();
