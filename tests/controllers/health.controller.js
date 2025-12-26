module.exports = {
  healthCheck(req, res) {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "unknown",
      env: process.env.NODE_ENV || "development",
    });
  },
};
