const express = require('express');
const postController = require('../../controllers/post');
const { requireAdminLogin } = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/posts/test', postController.testPost);
router.post('/posts', requireAdminLogin, postController.createPost);
router.get('/posts', postController.readPosts);
router.get('/posts/:id', postController.readOnePost);
router.delete('/posts/:id', requireAdminLogin, postController.deletePost);
router.patch('/posts/:id', requireAdminLogin, postController.updatePost);

module.exports = router;