const sequelize = require("../setup");

// Models 불러오기
const User = require("./User");
const RefreshToken = require("./RefreshToken");
const UserAuth = require("./UserAuth")
const Store = require("./Store");
const ReservationUnit = require("./ReservationUnit");

// 모델 간 관계 생성
// User - RefreshToken
User.hasMany(RefreshToken, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
RefreshToken.belongsTo(User, {
    foreignKey: "userId"
})

// User - UserAuth
User.hasMany(UserAuth, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
UserAuth.belongsTo(User, {
    foreignKey: "userId",
})

// User - Store
User.hasMany(Store, {
    foreignKey: "ownerId",
    onDelete: "CASCADE",
})
Store.belongsTo(User, {
    foreignKey: "ownerId",
})

// Store - ReservationUnit
Store.hasMany(ReservationUnit, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
})
ReservationUnit.belongsTo(Stroe, {
    foreignKey: "storeId",
})


module.exports = {
    sequelize,
    User,
    RefreshToken,
    UserAuth,
    Store,
    ReservationUnit,
}