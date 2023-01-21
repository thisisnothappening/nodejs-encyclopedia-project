const { Article, Category } = require("../model/models.js");
const { Op } = require("sequelize");
const ArticleNotFoundError = require("../error/ArticleNotFoundError");
const NullFieldError = require("../error/NullFieldError");

const getAllArticles = async (req, res) => {
	let name = req.query.name;
	let category = req.query.category;
	let categoryObject = await Category.findOne({ where: { name: category || "" } })
		.catch(err => console.log(err));
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
		.catch(err => console.log(err));
};

const getArticle = async (req, res) => {
	let id = req.params.id;
	let article = await Article.findByPk(id, { include: Category });
	try {
		if (!article) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}
	res.status(200).send(article);
};

const createArticleAndCategory = async (req, res) => {
	let { name, category, picture, text } = req.body;
	try {
		if (!name || name.trim().length === 0 ||
			!category || category.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new NullFieldError("Field cannot be null");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}

	await Category.findOrCreate({
		where: { name: category },
		defaults: {
			name: category
		}
	})
		.catch(err => console.log(err));

	let categoryObject = await Category.findOne({ where: { name: category } })
		.catch(err => console.log(err));

	await Article.create({
		name: name,
		categoryId: categoryObject.id,
		picture: picture,
		text: text,
	})
		.then(article => res.status(201).send(article))
		.catch(err => console.log(err));
};

// also deletes categories that are not referenced anymore by any article
const updateArticle = async (req, res) => {
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
		console.error(err);
		return res.status(err.status).json(err.description);
	}

	await Category.findOrCreate({
		where: { name: category },
		defaults: {
			name: category
		}
	})
		.catch(err => console.log(err));

	let newCategory = await Category.findOne({ where: { name: category } })
		.catch(err => console.log(err));

	let articleObject = await Article.findByPk(id);
	try {
		if (!articleObject) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}
	const oldCategory = await Category.findByPk(articleObject.categoryId);
	articleObject.set({
		name: name,
		categoryId: newCategory.id,
		picture: picture,
		text: text,
	});

	await articleObject.save()
		.then(articleObject => res.status(200).send(articleObject))
		.catch(err => console.log(err));

	const anyArticle = await Article.findOne({ where: { categoryId: oldCategory.id } });
	if (!anyArticle) {
		await oldCategory.destroy()
			.catch(err => console.log(err));
	}
};

// also deletes categories that are not referenced anymore by any article
const deleteArticle = async (req, res) => {
	let id = req.params.id;
	let articleObject = await Article.findByPk(id);
	try {
		if (!articleObject) {
			throw new ArticleNotFoundError("Article not found");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}
	const categoryObject = await Category.findByPk(articleObject.categoryId);
	await articleObject.destroy()
		.then((articleObject) => res.status(200).send(articleObject))
		.catch(err => console.log(err));

	const anyArticle = await Article.findOne({ where: { categoryId: categoryObject.id } });
	if (!anyArticle) {
		await categoryObject.destroy()
			.catch(err => console.log(err));
	}
};

module.exports = {
	getAllArticles,
	getArticle,
	createArticleAndCategory,
	updateArticle,
	deleteArticle
};