const { db, Article, Category } = require("../model/models.js");
// const db = require("./config/database");
const fsPromises = require('fs').promises;
const NullFieldError = require("../error/NullFieldError");
const path = require("path");
const InvalidFilePathError = require("../error/InvalidFilePathError.js");

const reset = async (filePath) => {
	if (typeof filePath !== "string") {
		throw new InvalidFilePathError("filePath must be a string");
	}
	await db.sync({ force: true }) // this function truncates the tables
		.catch(err => console.log(err));

	try {
		const data = await fsPromises.readFile(filePath, "utf8");
		let lines = data.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			const elements = line.split(" | ");
			const name = elements[0];
			const category = elements[1];
			const picture = elements[2];
			const text = elements[3];
			try {
				if (!name || name.trim().length === 0 ||
					!category || category.trim().length === 0 ||
					!picture || picture.trim().length === 0 ||
					!text || text.trim().length === 0) {
					throw new NullFieldError("Field cannot be null");
				}
			} catch (err) {
				return console.error(err);
			}

			const [categoryObject] = await Category.findOrCreate({
				where: { name: category },
				defaults: { name: category }
			})
				.catch(err => console.log(err));
			await Article.create({
				name: name,
				categoryId: categoryObject.id,
				picture: picture,
				text: text,
			})
				.catch(err => console.log(err));
		};
		console.log("\n\t--- DATABASE HAS BEEN RESET ---");
	} catch (err) {
		console.error(err);
	}
};

reset(path.join(__dirname, "..", "data", "articles.txt"));