const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');

router.route('/')
	.get(articleController.getAllArticles)
	.post(articleController.createArticleAndCategory);

router.route('/:id')
	.get(articleController.getArticle)
	.put(articleController.updateArticle)
	.delete(articleController.deleteArticle);

module.exports = router;