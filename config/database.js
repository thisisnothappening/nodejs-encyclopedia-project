const Sequelize = require("sequelize");
const dotenv = require("dotenv");

console.log(`\n\t--- Environment:   ${process.env.NODE_ENV} ---\n`)

if (process.env.NODE_ENV === "development") 
	dotenv.config({ path: ".env.development" });
if (process.env.NODE_ENV === "production") 
	dotenv.config({ path: ".env.production" });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: process.env.DB_DIALECT,
});

console.log("This line is for me to learn how to git pull");

if (process.env.NODE_ENV === "development")
	db.sync({ alter: true, match: /_test$/ })
		.catch(err => console.error(err));
else
	db.sync()
		.catch(err => console.error(err));

module.exports = db;
