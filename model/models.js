const Sequelize = require("sequelize");
const db = require("../config/database");

const ArticleSequelize = db.define("article", {
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
		refernces: {
			model: "category", // not sure about this
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

const CategorySequelize = db.define("category", {
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
}, {
	freezeTableName: true,
	tableName: "category",
	underscored: true,
});

class Article extends ArticleSequelize {
	static findByName(name) {
		return Article.findOne({ where: { name: name } });
	};
};

class Category extends CategorySequelize {
	static existsByPk(id) {
		if (Category.findByPk() === id) {
			return true;
		}
		return false;
	};
	static findByName(name) {
		return Category.findOne({ where: { name: name } });
	};
	static existsByName(name) {
		if (Category.findByName(name) !== null) {
			return true;
		}
		return false;
	};
};

Category.Article = Category.hasMany(Article, {
	foreignKey: "categoryId" // not sure about this
});
Article.Category = Article.belongsTo(Category, {
	foreignKey: "categoryId",
	onUpdate: "CASCADE",
	onDelete: "CASCADE"
});

db.sync({ alter: true })
	.catch(err => console.log(err));
		
module.exports = { Article, Category };