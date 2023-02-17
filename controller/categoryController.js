const ResourceNotFoundError = require("../error/ResourceNotFoundError.js");
const logRequest = require("../middleware/logRequest.js");
const { Article, Category } = require("../model/models.js");

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
		res.status(200).send(categories);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

const getCategory = async (req, res) => {
	try {
		const categoryObject = await Category.findByPk(req.params.id, { include: Article });
		if (!categoryObject) {
			throw new ResourceNotFoundError("Category not found");
		}
		res.status(200).send(categoryObject);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

// also deletes all it's articles
const deleteCategory = async (req, res) => {
	try {
		let categoryObject = await Category.findByPk(req.params.id);
		if (!categoryObject) {
			throw new ResourceNotFoundError("Category not found");
		}
		const categoryId = categoryObject.id;
		await categoryObject.destroy();
		res.status(200).send({ message: "Category deleted successfully" });
		logRequest(`Category ${categoryId} has been deleted.`);
	} catch (err) {
		console.error(err);
		return res.status(err.status || 500).json({ error: err.message });
	}
};

module.exports = {
	getAllCategories,
	getCategory,
	deleteCategory
};