const express = require("express");
const app = express();
const cors = require("cors");
const { Article, Category } = require("./model/models.js");
const db = require("./config/database.js");

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Error: " + err));

app.use(express.json());
app.use(cors());

app.get("/articles", async (req, res) => {
	await Article.findAll()
		.then(articles => res.send(articles))
		.catch(err => console.log(err));
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

app.get("/categories", async (req, res) => {
	await Category.findAll()
		.then(categories => res.send(categories))
		.catch(err => console.log(err));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
