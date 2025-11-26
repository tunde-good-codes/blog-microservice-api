import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import { createClient } from "redis";
import { startCacheConsumer } from "./utils/consumer.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
startCacheConsumer();
// Updated Redis client for Redis Cloud
export const redisClient = createClient({
    username: process.env.REDIS_USERNAME, // 'default'
    password: process.env.REDIS_PASSWORD, // your password
    socket: {
        host: process.env.REDIS_HOST, // redis-13584.c278.us-east-1-4.ec2.cloud.redislabs.com
        port: parseInt(process.env.REDIS_PORT || "13584")
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient
    .connect()
    .then(() => console.log("Connected to Redis Cloud"))
    .catch(console.error);
app.use("/api/v1", blogRoutes);
app.listen(port, () => {
    console.log(`blog Server is running on http://localhost:${port}`);
});
