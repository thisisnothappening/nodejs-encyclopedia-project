// I have some dependencies installed but somehow they're not shown in package.json ???

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createConnection({
	user: "DB Admin",
	host: "localhost",
	password: "P120401",
	database: "encyclopedia"
});

app.use(express.json());
app.use(cors());

app.get("/articles", (req, res) => {
	db.query(
		"SELECT * FROM article",
		(err, data) => {
			if (err) console.log(err);
			else res.send(data);
		}
	);
});

app.get("/categories", (req, res) => {
	db.query(
		"SELECT * FROM category",
		(err, data) => {
			if (err) console.log(err);
			else res.send(data);
		}
	)
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
