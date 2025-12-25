const { getRedisClient } = require("../config/redis");

/**
 * refresh token을 redis에도 저장해서
 * - refresh 요청 시 DB 조회 전에 redis로 1차 검증(빠름)
 * - logout/재로그인 시 redis에서 즉시 폐기 가능
 */
function keyRefresh(userId, refreshToken) {
  return `refresh:${userId}:${refreshToken}`;
}

async function storeRefreshToken(userId, refreshToken, ttlSec) {
  const redis = getRedisClient();
  if (redis.set.length >= 4) {
    return redis.set(keyRefresh(userId, refreshToken), "1", "EX", ttlSec);
  }
  return redis.set(keyRefresh(userId, refreshToken), "1", ttlSec);
}

async function existsRefreshToken(userId, refreshToken) {
  const redis = getRedisClient();
  if (typeof redis.exists === "function") {
    const n = await redis.exists(keyRefresh(userId, refreshToken));
    return Number(n) === 1;
  }
  const v = await redis.get(keyRefresh(userId, refreshToken));
  return !!v;
}

async function revokeRefreshToken(userId, refreshToken) {
  const redis = getRedisClient();
  return redis.del(keyRefresh(userId, refreshToken));
}

module.exports = {
  storeRefreshToken,
  existsRefreshToken,
  revokeRefreshToken,
};
