const Sequelize = require("sequelize");
const db = require("../config/database");

const Article = db.define("article", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	categoryId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: "category", 
			key: "id"
		},
	},
	picture: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	text: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
}, {
	freezeTableName: true,
	tableName: "article",
	underscored: true,
});

const Category = db.define("category", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
}, {
	freezeTableName: true,
	tableName: "category",
	underscored: true,
});

Category.hasMany(Article, {
	foreignKey: "categoryId"
});
Article.belongsTo(Category, {
	foreignKey: "categoryId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE"
});

module.exports = { Article, Category };
