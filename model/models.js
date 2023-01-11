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
		// allowNull: false,
	},
	category_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: null,
		foreignKey: true,
		unique: true,
		refernces: {
			model: "CategorySequelize",
			key: "id"
		},
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
	freezeTableName: true,
	tableName: "article",
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
		// allowNull: false,
	},
}, {
	freezeTableName: true,
	tableName: "category",
});

class Article extends ArticleSequelize {
	static findByName(name) {
		return Article.findOne({ where: { name: name } });
	};
	setCategory(category) {
		this.category_id = category._id;
	};
	// setCategoryId(_category_id) {
	// 	this.category_id = _category_id;
	// };
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
		if (Category.findByName(name).length() > 0) {
			return true;
		}
		return false;
	};
	get _id() {
		return this.id;
	};
	get _name() {
		return this.name;
	}
};

// Category.Article = Category.hasMany(Article, { foreignKey: "article_id" }); // this one throws error (bcuz there's no article_id in category)
Article.Category = Article.belongsTo(Category, {
	foreignKey: "category_id",
	onUpdate: "CASCADE",
	onDelete: "CASCADE"
});

db.sync({ alter: true })
	.catch((err) => {
		console.log(err);
	});

module.exports = { Article, Category };