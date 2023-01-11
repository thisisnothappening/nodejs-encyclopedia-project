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

app.get("/articles", (req, res) => {
	Article.findAll()
		.then(articles => res.send(articles))
		.catch(err => console.log(err));
});

app.post("/articles", async (req, res) => {
	let { name, category, picture, text } = req.body;
	let errors = [];

	if (!name) {
		errors.push({ text: "Please add a name" });
	}
	if (!category) {
		errors.push({ text: "Please add a category name" });
	}
	if (!picture) {
		errors.push({ text: "Please add a picture URL" });
	}
	if (!text) {
		errors.push({ text: "Please add a text" });
	}

	if (errors.length > 0) {
		res.send(
			errors
		);
		return;
	}

	let category1 = await Category.findOrCreate({
		where: { name: category },
		defaults: {
			name: category
		}
	});

	await Article.create({
		name: name,
		category_id: category1._id,
		picture: picture,
		text: text,
		// category: category1
	}, {
		// include: [ Category ]
	})
		.then(article => res.send(article))
		.catch(err => console.log(err));
});

app.get("/categories", (req, res) => {
	Category.findAll()
		.then(categories => res.send(categories))
		.catch(err => console.log(err));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
