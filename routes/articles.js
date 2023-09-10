const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');
const verifyJWT = require('../middleware/verifyJWT');

router.route("/")
	.get(articleController.getAllArticles)
	.post(verifyJWT, articleController.createArticleAndCategory);

router.route("/:id")
	.get(articleController.getArticle)
	.put(verifyJWT, articleController.updateArticle)
	.delete(verifyJWT, articleController.deleteArticle);

module.exports = router;
