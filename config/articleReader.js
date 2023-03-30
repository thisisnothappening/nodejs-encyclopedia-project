const { db, Article, Category } = require("../model/models.js");
// const db = require("./database");
const fsPromises = require('fs').promises;
const NullFieldError = require("../error/NullFieldError");
const path = require("path");

const fileArticlesPath = path.join(__dirname, "..", "docs", "articles.txt");
const fileArticlesImprovedPath = path.join(__dirname, "..", "docs", "articles_improved.txt");

const wikipediaReferenceBracketsRemover = async () => {
	try {
		await fsPromises.writeFile(fileArticlesImprovedPath, "");
		const data = await fsPromises.readFile(fileArticlesPath, "utf-8");
		let lines = data.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			await fsPromises.appendFile(fileArticlesImprovedPath, line.replace(/\[(.*?)]/g, ""));
			await fsPromises.appendFile(fileArticlesImprovedPath, "\n");
		}
	} catch (err) {
		console.error(err);
	}
};

const reset = async () => {
	await wikipediaReferenceBracketsRemover();
	try {
		await db.sync({ force: true, match: /_test$/ }); // this function truncates the tables

		const data = await fsPromises.readFile(fileArticlesImprovedPath, "utf-8");
		let lines = data.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			if (line.trim().length === 0) continue;
			const elements = line.split(" | ");
			const name = elements[0];
			const category = elements[1];
			const picture = elements[2];
			const text = elements[3];

			if (!name || name.trim().length === 0 ||
				!category || category.trim().length === 0 ||
				!picture || picture.trim().length === 0 ||
				!text || text.trim().length === 0) {
				throw new NullFieldError("Field cannot be null");
			}

			const [categoryObject] = await Category.findOrCreate({
				where: { name: category },
				defaults: { name: category }
			});
			await Article.create({
				name: name,
				categoryId: categoryObject.id,
				picture: picture,
				text: text,
			});
		};
		console.log("\n\t--- DATABASE HAS BEEN RESET ---");
	} catch (err) {
		console.error(err);
	}
};

reset();