const ResourceNotFoundError = require("../error/ResourceNotFoundError.js");
const logError = require("../middleware/logError.js");
const logRequest = require("../middleware/logRequest.js");
const { Article, Category } = require("../model/models.js");

const getAllCategories = async (req, res) => {
	await Category.findAll()
		.then(categories => res.status(200).send(categories))
		.catch(err => console.error(err));
};

const getCategory = async (req, res) => {
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id, { include: Article });
	try {
		if (!categoryObject) {
			throw new ResourceNotFoundError("Category not found");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}
	res.status(200).send(categoryObject);
};

// also deletes all it's articles
const deleteCategory = async (req, res) => {
	logRequest(req);
	let id = req.params.id;
	let categoryObject = await Category.findByPk(id)
		.catch(err => console.error(err));
	try {
		if (!categoryObject) {
			throw new ResourceNotFoundError("Category not found");
		}
	} catch (err) {
		logError(err);
		console.error(err);
		return res.status(err.status).json({ message: err.message });
	}
	await categoryObject.destroy()
		.then(() => res.status(200).send({ message: "Category deleted successfully" }))
		.catch(err => console.error(err));
};

module.exports = {
	getAllCategories,
	getCategory,
	deleteCategory
};