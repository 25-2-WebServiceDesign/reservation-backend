const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const StoreClosedDay = sequelize.define("StoreClosedDay", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    at: {
        type: DataTypes.DATEONLY,   // DATE (YYYY-MM-dd)
        allowNull: false,
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        defaultValue: "personal reason"
    },
}, {
    timestamps: false,
    paranoid: false,
    indexes: [
        {
            unique: true,
            fields: ["store_id", "at"]
        }
    ]
})

module.exports = StoreClosedDay;