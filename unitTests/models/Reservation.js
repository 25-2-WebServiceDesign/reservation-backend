const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const Reservation = sequelize.define("Reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    memo: {
        type: DataTypes.TEXT,
    },
    headcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELED_BY_CUSTOMER", "CANCELED_BY_STORE", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING",
    },
}, {
    timestamps: true,
    paranoid: false,
})

module.exports = Reservation;