const CategoryNotFoundError = require("../error/categoryNotFoundError.js");
const { Article, Category } = require("../model/models.js");

const getAllCategories = async (req, res) => {
	await Category.findAll()
		.then(categories => res.status(200).send(categories))
		.catch(err => console.log(err));
};

const getCategory = async (req, res) => {
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id, { include: Article });
	try {
		if (!categoryObject) {
			throw new CategoryNotFoundError("Category not found");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}
	res.status(200).send(categoryObject);
};

// also deletes all it's articles
const deleteCategory = async (req, res) => {
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id);
	try {
		if (!categoryObject) {
			throw new CategoryNotFoundError("Category not found");
		}
	} catch (err) {
		console.error(err);
		return res.status(err.status).json(err.description);
	}
	await categoryObject.destroy()
		.then(() => res.status(200).json("Category deleted"))
		.catch(err => console.log(err));
};

module.exports = {
	getAllCategories,
	getCategory,
	deleteCategory
};