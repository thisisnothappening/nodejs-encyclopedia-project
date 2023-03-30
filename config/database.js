const Sequelize = require("sequelize");

module.exports = new Sequelize("encyclopedia_test", "DBAdmin", "P120401", {
	host: "localhost",
	dialect: "mysql",
});