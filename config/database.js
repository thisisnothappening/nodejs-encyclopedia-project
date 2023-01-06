const Sequelize = require("sequelize");

// const db = mysql.createConnection({
// 	user: "DB Admin",
// 	host: "localhost",
// 	password: "P120401",
// 	database: "encyclopedia"
// });

// const sequelize = new Sequelize("mysql://DB Admin:P120401@localhost:3306/encyclopedia");

module.exports = new Sequelize("encyclopedia", "DB Admin", "P120401", {
	host: "localhost",
	dialect: "mysql",

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});