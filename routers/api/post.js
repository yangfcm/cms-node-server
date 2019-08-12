const express = require('express');
const postController = require('../../controllers/post');

const router = new express.Router();

router.get('/posts/test', postController.testPost);
router.post('/posts', postController.createPost);
router.get('/posts', postController.readPosts);
router.get('/posts/:id', postController.readOnePost);
router.delete('/posts/:id', postController.deletePost);
router.patch('/posts/:id', postController.updatePost);

module.exports = router;