const sequelize = require("../config/sequelize");
const {DataTypes} = require("sequelize");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    phone: {
        type: DataTypes.STRING(20),
        unique: true,
        validate: {
            is: {
                args: /^\+[1-9]\d{1,14}$/,
                msg: "전화번호는 E.164 형식이어야합니다. (+{국가번호}{전화번호})",
            }
        }
    },
    profile_image: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true,
        }
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "OWNER", "CUSTOMER"),
        allowNull: false,
        defaultValue: "CUSTOMER"
    },
}, {
    timestamps: true,
    underscored: true,
    paranoid: true,
})

// User.sync({force: true});

module.exports = User;

