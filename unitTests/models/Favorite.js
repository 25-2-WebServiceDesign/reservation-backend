const sequelize = require("../setup");
const {DataTypes} = require("sequelize");

const Favorite = sequelize.define('Favorite', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
