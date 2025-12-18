const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const User = require("./User")

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: User,
        //     key: "id",
        // },
        // onDelete: "CASCADE", // user 삭제 시 같이 삭제
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revokedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    timestamps: false,
})

module.exports = RefreshToken