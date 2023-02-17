const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
	.get(categoryController.getAllCategories);

router.route('/:id')
	.get(categoryController.getCategory)
	.delete(verifyJWT, categoryController.deleteCategory);

module.exports = router;