const sequelize = require("../config/sequelize");
const {DataTypes} = require("sequelize");

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "reservations",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 0,
            max: 10,
        }
    },
    content: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
}, {
    timestamps: true,
    paranoid: true,
})

module.exports = Review;