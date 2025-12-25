const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB || 0),
  maxRetriesPerRequest: 1,
});

redisClient.on("error", (err) => {
  console.error("[REDIS ERROR]", err?.message || err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("[REDIS] connected");
  }
  return redisClient;
}

module.exports = { redisClient, connectRedis };