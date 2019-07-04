const express = require('express');
const postController = require('../../controllers/post');

const router = new express.Router();

router.get('/posts/test', postController.testPost);

module.exports = router;