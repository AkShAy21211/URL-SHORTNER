import Redis from "ioredis";
import { SECREATS } from "./index.js";

console.log(SECREATS);


const redis = new Redis({
  host: "redis",
  port: 6379,
});


redis.on("connect", () => {
  console.log("Connected to Redis!");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
