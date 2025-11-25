import Redis from "ioredis";

const redis = new Redis(
process.env.REDIS_DATABASE_URL || "redis://localhost:6379"
);

redis.on("connect", () => {
console.log("Redis client connected");
});

redis.on("error", (err) => {
console.error("Redis client error:", err);
});

export default redis;
export { redis };
