const fs = require("fs");
const path = require("path");
const swaggerSpec = require("../config/swagger");

function exportSwaggerJson() {
  const outputPath = path.join(__dirname, "..", "..", "swagger.json");

  fs.writeFileSync(
    outputPath,
    JSON.stringify(swaggerSpec, null, 2),
    "utf-8"
  );

  console.log(`✅ Swagger JSON exported to ${outputPath}`);
}

exportSwaggerJson();
