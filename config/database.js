const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: process.env.DB_DIALECT,
});

const isTestEnv = process.env.DB_NAME.endsWith("_test");

const connect = () => {
	return db
		.authenticate()
		.then(() => {
			console.log("Database connected...");
			return db.sync({ alter: isTestEnv ? true : false });
		})
		.catch((err) => {
			console.error("Error: " + err);
			console.log("Retrying in 3 seconds...");
			setTimeout(connect, 3000);
		});
};

connect();

module.exports = db;
