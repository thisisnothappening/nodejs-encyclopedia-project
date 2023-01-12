const Sequelize = require("sequelize");

module.exports = new Sequelize("encyclopedia", "DB Admin", "P120401", {
	host: "localhost",
	dialect: "mysql",
});