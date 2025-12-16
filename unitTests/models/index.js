const sequelize = require("../setup");
const User = require("./User");
const RefreshToken = require("./RefreshToken");

User.hasMany(RefreshToken, {
    foreignKey: "userId",
    onDelete: "CASCADE",
})
RefreshToken.belongsTo(User, {
    foreignKey: "userId"
})

module.exports = {
    sequelize,
    User,
    RefreshToken
}