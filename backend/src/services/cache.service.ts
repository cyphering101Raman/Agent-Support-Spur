import { redis } from "../config/redis.js";

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (data) return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
  }
  return null;
}

export async function setCachedData(key: string, value: any, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
  }
}

export async function deleteCachedData(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error);
  }
}
