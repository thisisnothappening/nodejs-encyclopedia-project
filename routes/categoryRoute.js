const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

router.route('/')
	.get(categoryController.getAllCategories);

router.route('/:id')
	.get(categoryController.getCategory)
	.delete(categoryController.deleteCategory);

module.exports = router;