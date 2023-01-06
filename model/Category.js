const Sequelize = require("sequelize");
const db = require("../config/database");
// const Article = require("./Article.js");

const Category = db.define("category", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		// allowNull: false,
	},
}, {
	timestamps: false, // enable later
	freezeTableName: true,
	tableName: "category",
});

// Category.hasMany(Article, {
// 	foreignKey: "category_id"
// });

module.exports = Category;
