const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const ReservationUnit = sequelize.define("ReservationUnit", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: this.name,
    },
    profileImage: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    detailUrl: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    timestamps: true,
    paranoid: true,
})

module.exports = ReservationUnit;