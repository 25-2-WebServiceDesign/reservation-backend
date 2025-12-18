const {Sequelize} = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "memory",
    logging: false,
    define: {
        underscored: true,
    }
})

module.exports = sequelize