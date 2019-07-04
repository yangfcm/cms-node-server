const express = require('express');
const commentController = require('../../controllers/comment');

const router = new express.Router();

router.get('/comments/test', commentController.testComment);

module.exports = router;