const Redis = require("ioredis");

const isDisabled =
  process.env.REDIS_DISABLED === "true" ||
  process.env.NODE_ENV === "test";

const isOptional = process.env.REDIS_OPTIONAL === "true";

let client = null;
let memoryStore = null;

function createMemoryStore() {
  // key -> { value, expiresAt(ms) }
  const map = new Map();

  return {
    async set(key, value, ttlSec) {
      const expiresAt = ttlSec ? Date.now() + ttlSec * 1000 : null;
      map.set(key, { value, expiresAt });
      return "OK";
    },
    async get(key) {
      const item = map.get(key);
      if (!item) return null;
      if (item.expiresAt && item.expiresAt < Date.now()) {
        map.delete(key);
        return null;
      }
      return item.value;
    },
    async del(key) {
      map.delete(key);
      return 1;
    },
    async exists(key) {
      return (await this.get(key)) ? 1 : 0;
    },
  };
}

function getRedisClient() {
  if (isDisabled) {
    if (!memoryStore) memoryStore = createMemoryStore();
    return memoryStore;
  }

  if (client) return client;

  client = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB || 0),
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
  });

  client.on("error", (err) => {
    if (isOptional) {
      client = null;
      if (!memoryStore) memoryStore = createMemoryStore();
    }
  });

  return client;
}

module.exports = { getRedisClient };
