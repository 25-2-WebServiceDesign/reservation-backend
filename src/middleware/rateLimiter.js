const CustomError = require("../responses/customError");

const buckets = new Map();

module.exports = function rateLimiter(options = {}) {
  const windowMs = options.windowMs ?? 60_000; // 1분
  const max = options.max ?? 120;              // 1분 120회
  const skip = options.skip ?? (() => process.env.NODE_ENV === "test");

  return (req, res, next) => {
    if (skip(req)) return next();

    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }
    bucket.count += 1;
    buckets.set(key, bucket);

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - bucket.count)));
    res.setHeader("X-RateLimit-Reset", String(Math.floor(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      return next(new CustomError("TOO_MANY_REQUESTS", "Too many requests", 429));
    }

    next();
  };
};
