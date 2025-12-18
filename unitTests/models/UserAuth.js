const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const UserAuth = sequelize.define("UserAuth", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    provider: {
        type: DataTypes.ENUM("GOOGLE", "NAVER", "KAKAO"),
        allowNull: false,
    },
    providerUid: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    paranoid: false,
    indexes: [
        {
            unique: true,
            fields: ["provider", 'provider_uid'],
        }
    ],
})

module.exports = UserAuth;