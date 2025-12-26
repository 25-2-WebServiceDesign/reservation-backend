const sequelize = require('../config/sequelize');
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
        type: DataTypes.ENUM("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"),
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
    timestamps: false,
    paranoid: false,
})

module.exports = OperatingHour;