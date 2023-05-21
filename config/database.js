const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: process.env.DB_DIALECT,
});

db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
	.catch(err => console.error(err));

const isTestEnv = process.env.DB_NAME.endsWith("_test");

db.sync({ alter: isTestEnv ? true : false })
	.catch(err => console.error(err));

module.exports = db;
