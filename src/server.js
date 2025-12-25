require("dotenv").config();

const app = require("./app");
const { connectRedis } = require("./config/redis"); 

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectRedis(); 
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("[BOOT] failed to start server:", e?.message || e);
    process.exit(1);
  }
})();
