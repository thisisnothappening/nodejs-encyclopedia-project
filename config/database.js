const Sequelize = require("sequelize");
require("dotenv").config();

let db;

if (process.env.NODE_ENV === "development") {
	db = new Sequelize("encyclopedia_test", "DBAdmin", "P120401", {
		host: "localhost",
		port: 3306,
		dialect: "mysql",
	});
	db.sync({ alter: true, match: /_test$/ })
		.catch(err => console.error(err));
}

else if (process.env.NODE_ENV === "production") {
	db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT
	});
	db.sync()
		.catch(err => console.error(err));
}

module.exports = db;