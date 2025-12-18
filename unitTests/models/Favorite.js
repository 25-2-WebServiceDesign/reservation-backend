const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const Favorite = sequelize.define('Favorite', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "stores",
            key: "id",
        },
        onDelete: "CASCADE",
    }
}, {
    timestamps: true,
    updatedAt: false,
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ["user_id", "store_id"]
        }
    ]
})

module.exports = Favorite;
