import { SECREATS, logger } from "./index.js";
import { createClient } from "redis";

const client = createClient({
  username: SECREATS.REDIS_USERNAME,
  password: SECREATS.REDIS_PASSWORD,
  socket: {
    host: SECREATS.REDIS_HOST,
    port: SECREATS.REDIS_PORT,
  },
});

client.on("error", (err) => logger.info("Redis Client Error", err));

await client.connect();

export default client;
