import redisClient from "./redis-client";

export default class RedisService {
  static async setCache<T>(
    key: string,
    value: T,
    expirationSeconds: number = 3600
  ): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await redisClient.set(key, data, { EX: expirationSeconds });
    } catch (error) {
      console.error("Failed to set cache:", error);
    }
  }

  static async getCache<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await redisClient.get(key);
      return cachedData ? (JSON.parse(cachedData) as T) : null;
    } catch (error) {
      console.error("Failed to get cache:", error);
      return null;
    }
  }

  static async deleteCache(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Failed to delete cache:", error);
    }
  }
}
