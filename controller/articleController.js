const { Article, Category } = require("../model/models.js");
const { Op } = require("sequelize");

const getAllArticles = async (req, res) => {
	let name = req.query.name;
	let category = req.query.category;
	let categoryObject = await Category.findOne({ where: { name: category || "" } })
		.catch(err => console.log(err));
	await Article.findAll({
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
	let article = await Article.findByPk(id);
	if (!article) {
		return res.status(404).json({ "message": `Article not found` });
	}
	res.status(200).send(article);
};

const createArticleAndCategory = async (req, res) => {
	let { name, category, picture, text } = req.body;
	if (!name || name.trim().length === 0 ||
		!category || category.trim().length === 0 ||
		!picture || picture.trim().length === 0 ||
		!text || text.trim().length === 0) {
		return res.status(400).json({ "message": `Field cannot be null` });
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

const updateArticle = async (req, res) => {
	let id = req.params.id;
	let { name, category, picture, text } = req.body;
	if (!name || name.trim().length === 0 ||
		!category || category.trim().length === 0 ||
		!picture || picture.trim().length === 0 ||
		!text || text.trim().length === 0) {
		return res.status(400).json({ "message": `Field cannot be null` });
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

	let articleObject = await Article.findByPk(id);
	if (!articleObject) {
		return res.status(404).json({ "message": `Article not found` });
	}
	articleObject.set({
		name: name,
		categoryId: categoryObject.id,
		picture: picture,
		text: text,
	});

	await articleObject.save()
		.then(articleObject => res.status(200).send(articleObject))
		.catch(err => console.log(err));
};

const deleteArticle = async (req, res) => {
	let id = req.params.id;
	let articleObject = await Article.findByPk(id);
	if (!articleObject) {
		return res.status(404).json({ "message": `Article not found` });
	}
	await articleObject.destroy()
		.then(() => res.status(200).send("Article deleted"))
		.catch(err => console.log(err));
};

module.exports = {
	getAllArticles,
	getArticle,
	createArticleAndCategory,
	updateArticle,
	deleteArticle
};