
const express = require("express");
const app = express();
const cors = require("cors");
const Article = require("./model/Article.js");
const Category = require("./model/Category.js");

// Database
const db = require("./config/database.js");

// Test DB
db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Error: " + err));

app.use(express.json());
app.use(cors());

// app.get("/articles", (req, res) => {
// 	db.query(
// 		"SELECT * FROM article",
// 		(err, data) => {
// 			if (err) console.log(err);
// 			else res.send(data);
// 		}
// 	);
// });

// Article.belongsTo(Category);
// Category.hasMany(Article, {
// 	foreignKey: "category_id", // ???
// });

app.get("/articles", (req, res) => {
	Article.findAll()
	.then((articles) => res.send(articles))
	.catch((err) => console.log(err));
});

app.get("/categories", (req, res) => {
	Category.findAll()
	.then((categories) => res.send(categories))
	.catch((err) => console.log(err));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
