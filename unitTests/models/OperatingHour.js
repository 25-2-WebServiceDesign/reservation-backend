const sequelize = require('../setup');
const {DataTypes} = require("sequelize");

const OperatingHour = sequelize.define("OperatingHour", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    policyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dayOfWeek: {
        type: DataTypes.ENUM("SUN", "MON", "THU", "WED", "THU", "FRI", "SAT"),
        allowNull: false,
    },
    openTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    closeTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false,
    paranoid: true,
})

module.exports = OperatingHour;