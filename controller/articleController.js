const { Article, Category } = require("../model/models.js");
const { Op } = require("sequelize");
const ArticleNotFoundError = require("../error/ArticleNotFoundError");
const NullFieldError = require("../error/NullFieldError");
const logError = require("../middleware/logError.js");
const logRequest = require("../middleware/logRequest.js");

const getAllArticles = async (req, res) => {
	let name = req.query.name;
	let category = req.query.category;
	let categoryObject = await Category.findOne({ where: { name: category || "" } })
		.catch(err => console.error(err));
	await Article.findAll({
		include: Category,
		where: {
			name: { [Op.substring]: name || "" },
			categoryId: { [Op.substring]: categoryObject?.id || "" }
		}
	})
		.then(articles => {
			res.status(200).send(articles);
		})
		.catch(err => console.error(err));
};

const getArticle = async (req, res) => {
	let id = req.params.id;
	let article = await Article.findByPk(id, { include: Category })
		.catch(err => console.error(err));
	try {
		if (!article) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}
	res.status(200).send(article);
};

const createArticleAndCategory = async (req, res) => {
	logRequest(req);
	let { name, category, picture, text } = req.body;
	try {
		if (!name || name.trim().length === 0 ||
			!category || category.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new NullFieldError("Field cannot be null");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}

	let [categoryObject] = await Category.findOrCreate({
		where: { name: category },
		defaults: { name: category }
	})
		.catch(err => console.error(err));
	await Article.create({
		name: name,
		categoryId: categoryObject.id,
		picture: picture,
		text: text,
	})
		.then(article => res.status(201).send(article))
		.catch(err => console.error(err));
};

// also deletes categories that are not referenced anymore by any article
const updateArticle = async (req, res) => {
	logRequest(req);
	let id = req.params.id;
	let { name, category, picture, text } = req.body;
	try {
		if (!name || name.trim().length === 0 ||
			!category || category.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new NullFieldError("Field cannot be null");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}

	let [newCategory] = await Category.findOrCreate({
		where: { name: category },
		defaults: { name: category }
	})
		.catch(err => console.error(err));
	let articleObject = await Article.findByPk(id)
		.catch(err => console.error(err));
	try {
		if (!articleObject) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}
	const oldCategory = await Category.findByPk(articleObject.categoryId)
		.catch(err => console.error(err));
	articleObject.set({
		name: name,
		categoryId: newCategory.id,
		picture: picture,
		text: text,
	});

	await articleObject.save()
		.then(articleObject => res.status(200).send(articleObject))
		.catch(err => console.error(err));

	const anyArticle = await Article.findOne({ where: { categoryId: oldCategory.id } })
		.catch(err => console.error(err));
	if (!anyArticle) {
		await oldCategory.destroy()
			.catch(err => console.error(err));
	}
};

// also deletes categories that are not referenced anymore by any article
const deleteArticle = async (req, res) => {
	logRequest(req);
	let id = req.params.id;
	let articleObject = await Article.findByPk(id)
		.catch(err => console.error(err));
	try {
		if (!articleObject) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}
	const categoryObject = await Category.findByPk(articleObject.categoryId)
		.catch(err => console.error(err));
	await articleObject.destroy()
		.then(() => res.status(200).send({ message: "Article deleted successfully" }))
		.catch(err => console.error(err));

	const anyArticle = await Article.findOne({ where: { categoryId: categoryObject.id } })
		.catch(err => console.error(err));
	if (!anyArticle) {
		await categoryObject.destroy()
			.catch(err => console.error(err));
	}
};

module.exports = {
	getAllArticles,
	getArticle,
	createArticleAndCategory,
	updateArticle,
	deleteArticle
};