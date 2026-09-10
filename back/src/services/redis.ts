import { createClient } from "redis";
import { REDIS_URL } from "../constants";
// docker run -d --name my-redis -p 6379:6379 redis:alpine

export const redisClient = createClient({
  url: REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();
