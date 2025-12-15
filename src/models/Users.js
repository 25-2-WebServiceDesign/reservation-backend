const sequelize = require("../config/sequelize");
const {DataTypes} = require("sequelize");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING
    },
    profile_image: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM,
        values: ['ADMIN', "OWNER", "CUSTOMER"],
        allowNull: false,
    },
}, {

})

module.exports = User;