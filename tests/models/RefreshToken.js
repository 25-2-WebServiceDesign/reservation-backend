const sequelize = require("../config/sequelize");
const {DataTypes} = require("sequelize");

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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