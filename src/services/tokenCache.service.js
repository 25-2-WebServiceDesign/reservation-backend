const { redisClient, connectRedis } = require("../config/redis");

const RT_PREFIX = "rt:";

function rtKey(userId) {
  return `${RT_PREFIX}${userId}`;
}

async function storeRefreshToken(userId, refreshToken, ttlSeconds = 60 * 60 * 24 * 14) {
  await connectRedis();
  const key = rtKey(userId);
  await redisClient.set(key, refreshToken, { EX: ttlSeconds });
  return true;
}

async function getRefreshToken(userId) {
  await connectRedis();
  return await redisClient.get(rtKey(userId));
}

async function deleteRefreshToken(userId) {
  await connectRedis();
  return await redisClient.del(rtKey(userId));
}

async function setToken(key, value, ttlSeconds) {
  await connectRedis();
  if (ttlSeconds) return await redisClient.set(key, value, { EX: ttlSeconds });
  return await redisClient.set(key, value);
}

async function getToken(key) {
  await connectRedis();
  return await redisClient.get(key);
}

async function deleteToken(key) {
  await connectRedis();
  return await redisClient.del(key);
}

async function revokeRefreshToken(userId, refreshToken) {
  await connectRedis();

  const key = rtKey(userId);
  const storedToken = await redisClient.get(key);

  // Redis에 토큰이 없으면 그냥 종료
  if (!storedToken) return false;

  // 다른 토큰이면 삭제하지 않음 (안전장치)
  if (storedToken !== refreshToken) return false;

  await redisClient.del(key);
  return true;
}


module.exports = {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  revokeRefreshToken,
  setToken,
  getToken,
  deleteToken,
};
