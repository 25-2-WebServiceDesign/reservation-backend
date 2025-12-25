const sequelize = require("../config/sequelize");
const {DataTypes} = require("sequelize");

const Store = sequelize.define("Store", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    homepageUrl: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    detail: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: true,
    paranoid: true,
})

module.exports = Store;