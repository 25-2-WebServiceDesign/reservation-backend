const { sequelize } = require("../src/models");
const repos = require("../src/repositories");

function pickRepo(reposObj, patterns) {
  for (const p of patterns) {
    const r = reposObj[p];
    if (r && typeof r.create === "function") return r;
  }

  const keys = Object.keys(reposObj);
  for (const key of keys) {
    const lower = key.toLowerCase();
    const match = patterns.some((p) => lower.includes(String(p).toLowerCase().replace(/repo|repository/g, "")));
    const r = reposObj[key];
    if (match && r && typeof r.create === "function") return r;
  }

  throw new Error(
    `Repo not found. patterns=${JSON.stringify(patterns)}\nexports=${JSON.stringify(Object.keys(reposObj))}`
  );
}

const userRepo = pickRepo(repos, ["userRepo", "usersRepo", "userRepository"]);
const storeRepo = pickRepo(repos, ["storeRepo", "storesRepo", "storeRepository"]);
const unitRepo = pickRepo(repos, ["unitRepo", "unitsRepo", "unitRepository"]);
const reservationRepo = pickRepo(repos, ["reservationRepo", "reservationsRepo", "reservationRepository", "reservationsRepository"]);
const reviewRepo = pickRepo(repos, ["reviewRepo", "reviewsRepo", "reviewRepository"]);

async function safeTruncate(tableName) {
  try {
    await sequelize.query(`TRUNCATE TABLE \`${tableName}\``);
    console.log(`🧹 truncated: ${tableName}`);
  } catch (e) {
  }
}

async function resetDatabase() {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

  const tables = [
    "reviews",
    "reservations",
    "units",
    "stores",
    "store_favorites",
    "refresh_tokens",
    "user_auths",
    "users",
  ];

  for (const t of tables) {
    await safeTruncate(t);
  }

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
}

async function seed() {
  await sequelize.sync({ alter: false });

  console.log("Seeding started...");

  await resetDatabase();

  // ===== 1) Users (50) =====
  const users = [];
  for (let i = 1; i <= 50; i++) {
    const user = await userRepo.create({
      email: `user${i}@example.com`,
      nickname: `user${i}`,
      role: i <= 5 ? "ADMIN" : "USER",
      phone: `+8210${String(12340000 + i).padStart(8, "0")}`,
      profileImage: null,
    });
    users.push(user);
  }

  // ===== 2) Stores (30) =====
  const stores = [];
  const categories = ["HAIR", "CAFE", "RESTAURANT"]; // Store.category NOT NULL 대응

  for (let i = 1; i <= 30; i++) {
    const owner = users[i % users.length];

    const store = await storeRepo.create({
      ownerId: owner.id,
      name: `Store ${i}`,
      category: categories[i % categories.length],
      description: `Seed store ${i}`,
      address: `Seoul ${i}`,
      phone: `+8210${String(20000000 + i).padStart(8, "0")}`,
      isOpen: true,
    });

    stores.push(store);
  }

  // ===== 3) Units (60) =====
  const units = [];
  for (let i = 1; i <= 60; i++) {
    const store = stores[i % stores.length];

    const unit = await unitRepo.create({
      storeId: store.id,
      name: `Unit ${i}`,
      description: `Seed unit description ${i}`,
      price: 10000 + i * 100,
      durationMin: 30,
      isActive: true,
    });

    units.push(unit);
  }

// ===== 4) Reservations (60) =====
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

const reservations = [];
for (let i = 1; i <= 60; i++) {
  const user = users[i % users.length];
  const unit = units[i % units.length];

  const base = new Date();
  base.setSeconds(0, 0);

  const startTime = addMinutes(base, i * 10);
  const endTime = addMinutes(startTime, 30);

  const reservation = await reservationRepo.create({
    userId: user.id,
    unitId: unit.id,
    status: "CONFIRMED",
    startTime,
    endTime,
  });

  reservations.push(reservation);
}

  // ===== 5) Reviews (20) =====
  for (let i = 1; i <= 20; i++) {
    const r = reservations[i];

    await reviewRepo.create({
      reservationId: r.id,
      userId: r.userId,
      rating: (i % 5) + 1,
      comment: `Review ${i}`,
    });
  }

  console.log("Seeding completed! (50 + 30 + 60 + 60 + 20 = 220)");
  process.exit(0);
}

seed().catch((err) => {
  console.error(" Seeding failed:", err);
  process.exit(1);
});
