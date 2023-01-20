const { db, Article, Category } = require("../model/models.js");
// const db = require("./config/database");
const fs = require('fs');
const readline = require('readline');
const NullFieldError = require("../error/NullFieldError");
const path = require("path");

const reset = async () => {
	await db.sync({ force: true }) // this function truncates the tables
		.catch(err => console.log(err));

	const fileStream = fs.createReadStream(path.join(__dirname, "..", "data", "articles.txt"));
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
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
			.catch(err => console.log(err));
	}
	console.log("\n\t--- DATABASE HAS BEEN RESET ---");
};

reset();