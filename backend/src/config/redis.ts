import "dotenv/config";
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables.");
}

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err: any) => {
  console.error("❌ Redis connection error:", err.message);
});

redis.on("close", () => {
  console.warn("⚠️ Redis connection closed");
});