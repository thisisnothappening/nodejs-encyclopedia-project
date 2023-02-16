const { Article, Category } = require("../model/models.js");
const { Op } = require("sequelize");
const NullFieldError = require("../error/NullFieldError");
const logError = require("../middleware/logError.js");
const logRequest = require("../middleware/logRequest.js");
const ResourceNotFoundError = require("../error/ResourceNotFoundError.js");

const getAllArticles = async (req, res) => {
	try {
		let name = req.query.name;
		let category = req.query.category;
		let categoryObject = await Category.findOne({ where: { name: category || "" } });
		await Article.findAll({
			include: Category,
			where: {
				name: { [Op.substring]: name || "" },
				...(categoryObject && { categoryId: categoryObject.id })
			}
		})
			.then(articles => res.status(200).send(articles));
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}

};

const getArticle = async (req, res) => {
	try {
		let article = await Article.findByPk(req.params.id, { include: Category });
		if (!article) {
			throw new ResourceNotFoundError("Article not found");
		}
		res.status(200).send(article);
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

const createArticleAndCategory = async (req, res) => {
	logRequest(req);
	try {
		let { name, category: categoryName, picture, text } = req.body;
		if (!name || name.trim().length === 0 ||
			!categoryName || categoryName.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new NullFieldError("Field cannot be null");
		}
		const [categoryObject] = await Category.findOrCreate({
			where: { name: categoryName },
			defaults: { name: categoryName }
		});
		await Article.create({
			name: name,
			categoryId: categoryObject.id,
			picture: picture,
			text: text,
		})
			.then(article => res.status(201).send(article));
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

// also deletes categories that are not referenced anymore by any article
const updateArticle = async (req, res) => {
	logRequest(req);
	try {
		let { name, category: categoryName, picture, text } = req.body;
		if (!name || name.trim().length === 0 ||
			!categoryName || categoryName.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new NullFieldError("Field cannot be null");
		}
		const [newCategory] = await Category.findOrCreate({
			where: { name: categoryName },
			defaults: { name: categoryName }
		});
		let articleObject = await Article.findByPk(req.params.id);
		if (!articleObject) {
			throw new ResourceNotFoundError("Article not found");
		}
		const oldCategory = await Category.findByPk(articleObject.categoryId);
		articleObject.set({
			name: name,
			categoryId: newCategory.id,
			picture: picture,
			text: text,
		});

		await articleObject.save();
		res.status(200).send(articleObject);

		const anyArticle = await Article.findOne({ where: { categoryId: oldCategory.id } });
		if (!anyArticle) {
			await oldCategory.destroy();
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).send({ error: err.message });
	}
};

// also deletes categories that are not referenced anymore by any article
const deleteArticle = async (req, res) => {
	logRequest(req);
	try {
		let articleObject = await Article.findByPk(req.params.id);
		if (!articleObject) {
			throw new ResourceNotFoundError("Article not found");
		}

		const categoryObject = await Category.findByPk(articleObject.categoryId);
		await articleObject.destroy();
		res.status(200).send({ message: "Article deleted successfully" });

		const anyArticle = await Article.findOne({ where: { categoryId: categoryObject.id } });
		if (!anyArticle) {
			await categoryObject.destroy();
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	getAllArticles,
	getArticle,
	createArticleAndCategory,
	updateArticle,
	deleteArticle
};