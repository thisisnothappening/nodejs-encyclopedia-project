const { Article, Category } = require("../model/models.js");

const getAllCategories = async (req, res) => {
	await Category.findAll()
		.then(categories => res.status(200).send(categories))
		.catch(err => console.log(err));
};

const getCategory = async (req, res) => {
	let id = req.params.id;
	let category = await Category.findByPk(id);
	if (!category) {
		return res.status(404).json({ "message": `Category not found` });
	}
	res.status(200).send(category);
};

// also deletes all it's articles
const deleteCategory = async (req, res) => {
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id);
	if (!categoryObject) {
		return res.status(404).json({ "message": `Category not found` });
	}
	await categoryObject.destroy()
		.then(() => res.status(200).send("Category deleted"))
		.catch(err => console.log(err));
};

module.exports = {
	getAllCategories,
	getCategory,
	deleteCategory
};