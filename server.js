const express = require("express");
const app = express();
const cors = require("cors");
const { Article, Category } = require("./model/models.js");
const db = require("./config/database.js");
const { Op } = require("sequelize");

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Error: " + err));

app.use(express.json());
app.use(cors());

app.get("/articles", async (req, res) => {
	let name = req.query.name;
	let categoryId = req.query.categoryId;
	// let category = await Category.findByPk(categoryId)
	// 	.catch(err => console.log(err));
	await Article.findAll({
		where: {
			name: { [Op.substring]: name || "" },
			categoryId: { [Op.substring]: categoryId || "" }
		}
	})
		.then(articles => {
			// articles.forEach(article => {
			// 	article.category = category?.name;
			// });
			res.send(articles)
		})
		.catch(err => console.log(err));
});

app.get("/articles/:id", async (req, res) => {
	let id = req.params.id;
	let article = await Article.findByPk(id);
	try {
		if (!article) {
			throw new Error("Article not found");
		}
		res.send(article);
	} catch (err) {
		console.log(err);
		return res.status(404).send(err.message);
	}
});

app.post("/articles", async (req, res) => {
	// category is category.name
	let { name, category, picture, text } = req.body;
	try {
		if (!name || name.trim().length === 0 ||
			!category || category.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new Error("Field cannot be null");
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
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
		.then(article => res.send(article))
		.catch(err => console.log(err));
});

app.put("/articles/:id", async (req, res) => {
	let id = req.params.id;
	let { name, category, picture, text } = req.body;
	try {
		if (!name || name.trim().length === 0 ||
			!category || category.trim().length === 0 ||
			!picture || picture.trim().length === 0 ||
			!text || text.trim().length === 0) {
			throw new Error("Field cannot be null");
		}
	} catch (err) {
		console.log(err);
		return res.status(400).send(err.message);
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
	try {
		if (!articleObject) {
			throw new Error("Article not found");
		}
	} catch (err) {
		console.log(err);
		return res.status(404).send(err.message);
	}
	articleObject.set({
		name: name,
		categoryId: categoryObject.id,
		picture: picture,
		text: text,
	});

	await articleObject.save()
		.then(articleObject => res.send(articleObject))
		.catch(err => console.log(err));
});

app.delete("/articles/:id", async (req, res) => {
	let id = req.params.id;
	let articleObject = await Article.findByPk(id);
	try {
		if (!articleObject) {
			throw new Error("Article not found");
		}
	} catch (err) {
		console.log(err);
		return res.status(404).send(err.message);
	}

	await articleObject.destroy()
		.then(() => res.send("This article is no more!"))
		.catch(err => console.log(err));
});

app.get("/categories", async (req, res) => {
	await Category.findAll()
		.then(categories => res.send(categories))
		.catch(err => console.log(err));
});

app.get("/categories/:id", async (req, res) => {
	let id = req.params.id;
	let category = await Category.findByPk(id);
	try {
		if (!category) {
			throw new Error("Category not found");
		}
		res.send(category);
	} catch (err) {
		console.log(err);
		return res.status(404).send(err.message);
	}
});

// also deletes all it's articles
app.delete("/categories/:id", async (req, res) => {
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id);
	try {
		if (!categoryObject) {
			throw new Error("Category not found");
		}
	} catch (err) {
		console.log(err);
		return res.status(404).send(err.message);
	}

	await categoryObject.destroy()
		.then(() => res.send("This category is no more!"))
		.catch(err => console.log(err));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
