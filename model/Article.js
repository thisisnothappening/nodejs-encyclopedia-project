const Sequelize = require("sequelize");
const db = require("../config/database");
// const Category = require("./Category");

const Article = db.define("article", {
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
	category_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	picture: {
		type: Sequelize.TEXT,
		// allowNull: false,
	},
	text: {
		type: Sequelize.TEXT,
		// allowNull: false,
	},
}, {
	timestamps: false, // enable later
	freezeTableName: true,
	tableName: "article",
});

// Article.belongsTo(Category);

module.exports = Article;
