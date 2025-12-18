const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const ReservationPolicy = sequelize.define("ReservationPolicy", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    slotDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
    },
    maximumHeadcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    timestamps: false,
    paranoid: false,
})

module.exports = ReservationPolicy;