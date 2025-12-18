const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const UnitClosedDay = sequelize.define("UnitClosedDay", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    at: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        defaultValue: "personal reason"
    }
}, {
    timestamps: false,
    paranoid: false,
    indexes: [
        {
            unique: true,
            fields: ["unit_id", "at"]
        }
    ]
})

module.exports = UnitClosedDay;